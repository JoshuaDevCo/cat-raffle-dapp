import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { DECIMALS, DEFAULT_PAY_TYPE, TOKEN_PAY_TYPE } from "../config";
import { getNftMetaData } from "../contexts/utils";
import { useRouter } from "next/router";
import { raffleCard } from "../configs/raffleCard";
import { TemplateItem } from "./TemplateItem";

export default function RaffleCard(props: {
  ticketPricePrey: number;
  ticketPriceSol: number;
  endTimestamp: number;
  ticketsCount: number;
  nftMint: string;
  raffleKey: string;
  maxEntrants: number;
  pipe: any;
}) {
  const {
    ticketPricePrey,
    ticketPriceSol,
    maxEntrants,
    raffleKey,
    endTimestamp,
    nftMint,
    ticketsCount,
    pipe,
  } = props;
  const router = useRouter();
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [payType, setPayType] = useState("--");
  const { t } = pipe;

  const counterUpdate = () => {
    getNFTdetail();
  };

  const getNFTdetail = async () => {
    try {
      const uri = await getNftMetaData(new PublicKey(nftMint));
      const resp = await fetch(uri);
      const { image, name, description } = await resp.json();
      setImage(image);
      setName(name);
      setDescription(description);
      if (ticketPricePrey === 0) {
        setPrice(ticketPriceSol / LAMPORTS_PER_SOL);
        setPayType(DEFAULT_PAY_TYPE);
      } else if (ticketPriceSol === 0) {
        setPrice(ticketPricePrey / DECIMALS);
        setPayType(TOKEN_PAY_TYPE);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getNFTdetail();
    // eslint-disable-next-line
  }, []);

  return (
    <TemplateItem
      items={[
        raffleCard({
          raffleKey,
          image,
          endTimestamp,
          name,
          price,
          payType,
          ticketsCount,
          maxEntrants,
          description,
        }),
      ]}
      pipe={{ t, router, counterUpdate }}
    ></TemplateItem>
  );
}
