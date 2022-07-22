import { Box, Breakpoint, Card, CardContent, CardMedia, Container, Grid, Typography } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { map } from "lodash";
import moment from "moment";
import Image from "mui-image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TFunction } from "react-i18next";
import { TemplateItem } from "../../components/TemplateItem";
import { DEBUG, FLOATING_PTS_FIXED_DECIMAL } from "../../config";
import { raffleDetail } from "../../configs/raffleDetail";
import {
  buyTicket,
  claimReward,
  getStateByKey,
  revealWinner,
  withdrawNft,
  closeRaffle,
} from "../../contexts/transaction";
import { NFTRaffleData } from "../../contexts/type";
import { adminValidation } from "../../contexts/utils";
import { getNFTdetail } from "../../services/fetchData";

export default function RaffleItemPage(props: {
  startLoading: Function;
  closeLoading: Function;
  t: TFunction
}) {
  const wallet = useWallet();
  const router = useRouter();
  const { startLoading, closeLoading, t } = props;
  const { raffleKey } = router.query;
  const [mint, setMint] = useState("");
  const [image, setImage] = useState("");
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [tickets, setTickets] = useState(1);
  const [raffleData, setRaffleData] = useState<NFTRaffleData>();

  const toFixed = (value: number) => value.toFixed(FLOATING_PTS_FIXED_DECIMAL);

  const counterUpdate = async () => {
    await updateNFTDetail();
  }

  const debugDataInject = () => {
    if (!DEBUG) return;
    setRaffleData({
      tickets: 248,
      // end: moment().add('5','d').valueOf(),
      end: moment().add('-5','d').valueOf(),
      wl: 0,
      price: 0.1,
      payType: 'SOL',
      maxTickets: 1000,
      winnerCnt: 5,
      winners: [{
        address: 'Auh2DLaxXjFAetZSTfZcMbZv8HPSmv1yziZPmaqnT7Qa',
        index: 88,
        claimed: 0
      }],
      isRevealed: false,
      isClaimed: false,
      isWinner: false,
      allClaimed: false,
      myTickets: [
        { index: Math.floor(Math.random() * 100)},
        { index: Math.floor(Math.random() * 100)},
        { index: Math.floor(Math.random() * 100)},
        { index: Math.floor(Math.random() * 100)},
        { index: Math.floor(Math.random() * 100)}
      ]
    });
    setImage('https://arweave.net/drvTIdCEBJLV2jqXNg4hrqDOAiCC0KmQ1AHpwi96e5k?ext=png');
    setNftName('Myths of Myrien #1125');
    setNftDescription('A Collection of 2888 Mythical Masks of Myrien');
  }

  const updateNFTDetail = async () => {
    const { image, name, description, raffleData } = await getNFTdetail({
      wallet,
      mint,
      raffleKey,
    });
    setRaffleData(raffleData);
    setImage(image);
    setNftName(name);
    setNftDescription(description);
    debugDataInject();
  }

  const getRaffleData = async () => {
    console.debug(raffleKey, "raffleKey");
    if (raffleKey === undefined) return;
    try {
      startLoading();
      const raffle = await getStateByKey(new PublicKey(raffleKey));
      if (raffle !== null) {
        const mint = raffle.nftMint.toBase58();
        setMint(mint);
        await updateNFTDetail();
      }
    } catch (error) {
      console.error(error);
    } finally {
      closeLoading();
    }
  };

  const handleClose = async () => {
    if (!raffleKey) {
      return;
    }
    try {
      startLoading();
      await closeRaffle(wallet, new PublicKey(raffleKey));
      router.push("/create-raffle");
    } catch (error) {
      console.error(error);
    } finally {
      closeLoading();
    }
  };

  const handleReClaim = async () => {
    if (mint === "") {
      return;
    }
    try {
      startLoading();
      await withdrawNft(wallet, new PublicKey(mint));
      router.push("/create-raffle");
    } catch (error) {
      console.error(error);
    } finally {
      closeLoading();
    }
  };

  const handlePurchase = async () => {
    if (mint === "") {
      return;
    }
    try {
      startLoading();
      await buyTicket(wallet, new PublicKey(mint), tickets);
      await updateNFTDetail();
    } catch (error) {
      console.error(error);
    } finally {
      closeLoading();
    }
  };

  const handleRevealWinner = async () => {
    if (!raffleKey) {
      return;
    }
    try {
      startLoading();
      await revealWinner(wallet, new PublicKey(raffleKey));
      await updateNFTDetail();
    } catch (error) {
      console.error(error);
    } finally {
      closeLoading();
    }
  };

  const handleClaim = async () => {
    if (mint === "") {
      return;
    }
    try {
      startLoading();
      await claimReward(wallet, new PublicKey(mint));
      await updateNFTDetail();
    } catch (error) {
      console.error(error);
    } finally {
      closeLoading();
    }
  };

  const updatePage = async () => {
    if (wallet.publicKey !== null) {
      const admin = adminValidation(wallet);
      setIsAdmin(admin);
    }
    if (raffleKey !== undefined) {
      await getRaffleData();
    }
  };

  useEffect(() => {
    updatePage();
    // eslint-disable-next-line
  }, [wallet.connected, router]);
  const template = raffleDetail({ name: nftName, description: nftDescription });
  return (
    <Box sx={template.sx} >
      <Container maxWidth={template.maxWidth as Breakpoint}>
        <Grid container spacing={template.spacing}>
          <Grid item xs={template.cardView?.xs} md={template.cardView?.md}>
            <Card sx={template.cardView?.sx}>
              <CardMedia>
                <Image src={image || ''} showLoading alt="" />
              </CardMedia>
              <CardContent>
                <TemplateItem items={template.cardView?.items} pipe={{ t }}></TemplateItem>
              </CardContent>
            </Card>
          </Grid>
          {map(template.gridCols, ({ items, ...col}) => {
            const colPipe: any = {
              wallet, router, startLoading, closeLoading, t, raffleKey,
              isAdmin,
              tickets, setTickets,
              raffleData,
              counterUpdate,
              handleClose,
              handleReClaim,
              handlePurchase,
              handleRevealWinner,
              handleClaim,
              toFixed
            };
            return (<Grid item {...col}>
              <TemplateItem items={items} pipe={colPipe}></TemplateItem>
            </Grid>)
          })}
        </Grid>
      </Container>
      
    </Box>
  );
}
