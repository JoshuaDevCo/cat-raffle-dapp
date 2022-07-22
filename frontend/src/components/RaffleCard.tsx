import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { DECIMALS, DEFAULT_PAY_TYPE, TOKEN_PAY_TYPE } from "../config";
import { getNftMetaData } from "../contexts/utils";
import { useRouter } from "next/router";
import Link from "next/link";
import Countdown from "./Countdown";
import Image from "mui-image";
import { Loading } from "./Loading";

export default function RaffleCard(props: {
  ticketPricePrey: number;
  ticketPriceSol: number;
  endTimestamp: number;
  ticketsCount: number;
  nftMint: string;
  raffleKey: string;
  maxEntrants: number;
}) {
  const {
    ticketPricePrey,
    ticketPriceSol,
    maxEntrants,
    raffleKey,
    endTimestamp,
    nftMint,
    ticketsCount,
  } = props;
  const router = useRouter();
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [payType, setPayType] = useState("--");

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
      console.error(error)
    }
    
  };
  useEffect(() => {
    getNFTdetail();
    // eslint-disable-next-line
  }, []);

  return (
    <div
      className="raffle-card"
      onClick={() => router.push("/raffle/" + raffleKey)}
    >
      <div className="media">
        <Image src={image} alt="" showLoading={<Loading/>}
          style={{
            filter:
              endTimestamp < new Date().getTime() ? "grayscale(1)" : "none",
          }}></Image>
      </div>
      <div className="card-content">
        <div className="top-content">
          <h3 className="card-title title-1">{name}</h3>
          <p className="card-price">
            {price} {payType}
          </p>
          {/* <p className="card-total-item">Total item: <span>250</span></p> */}
          <div className="card-countdown">
            {endTimestamp > new Date().getTime() ? (
              <>
                <p>End in:</p>
                <Countdown
                  endDateTime={endTimestamp}
                  update={() => getNFTdetail()}
                />
              </>
            ) : (
              <>Closed</>
            )}
          </div>
          <p className="card-total-item">
            {ticketsCount}/{maxEntrants} Filled
          </p>
          <p className="card-description">
            {description.slice(0, 120)}
            {description.length > 120 && "..."}
            {description.length > 120 && (
              <span>
                <Link href={"/raffle/" + raffleKey}>
                  <a>Read more</a>
                </Link>
              </span>
            )}
          </p>
        </div>
        <div className="bottom-content">
          <p>
            not enough prey, hunt some
            <span>
              <Link href="https://">
                <a>here</a>
              </Link>
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
