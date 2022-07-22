import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import moment from "moment";
import { createRaffle } from "../../../contexts/transaction";
import { errorAlert } from "../../../components/toastGroup";
import { getNFTdetail } from "../../../services/fetchData";
import Image from "mui-image";
import { DEFAULT_PAY_TYPE, TOKEN_PAY_TYPE } from "../../../config";
import { Loading } from "../../../components/Loading";
import { TFunction } from "react-i18next";
import { NumberInput } from "../../../components/NumberInput";

export default function CreateNewRafflePage(props: {
  startLoading: Function;
  closeLoading: Function;
  t: TFunction
}) {
  const { startLoading, closeLoading, t } = props;
  const router = useRouter();
  const wallet = useWallet();
  const { mint } = router.query;
  const [image, setImage] = useState("");
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [rewardPrice, setRewardPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("sol");
  const [rewardType, setRewardType] = useState("nft");

  const [winnerCount, setWinnerCount] = useState(1);
  const [price, setPrice] = useState<number|undefined>(0);
  const [maxTickets, setMaxTickets] = useState();
  const [endTime, setEndTime] = useState(moment(new Date()).format());

  const handlePayment = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod((event.target as HTMLInputElement).value);
  };

  const handleRewardType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRewardType((event.target as HTMLInputElement).value);
  };

  const handleCreate = async () => {
    if (mint === undefined) return;
    if (checkValidate()) {
      let solPrice;
      let splPrice;
      if (paymentMethod === "sol") {
        solPrice = price;
        splPrice = 0;
      } else if (paymentMethod === "spl") {
        solPrice = 0;
        splPrice = price;
      }
      if (solPrice === undefined) return;
      if (splPrice === undefined) return;
      if (maxTickets === undefined) return;
      let winnerCnt = 1;
      let white = 0;
      if (rewardType === "nft") {
        white = 2;
        winnerCnt = 1;
      } else if (rewardType === "whitelist") {
        winnerCnt = winnerCount;
        white = 0;
      } else if (rewardType === "spl") {
        winnerCnt = winnerCount;
        white = 1;
      }

      try {
        startLoading();
        await createRaffle(
          wallet,
          new PublicKey(mint),
          solPrice,
          splPrice,
          new Date(endTime).getTime() / 1000,
          rewardPrice,
          winnerCnt,
          white,
          maxTickets
        );
        router.push("/raffle");
      } catch (error) {
        console.error(error);
      } finally {
        closeLoading();
      }
    }
  };

  const checkValidate = () => {
    if (price === 0) {
      errorAlert("Please enter correct price");
      return false;
    }
    const now = new Date();
    const end = new Date(endTime);
    if (now >= end) {
      errorAlert("Please enter correct end date");
      return false;
    }
    if (
      rewardType === "whitelist" &&
      (winnerCount === undefined || winnerCount === 0)
    ) {
      errorAlert("Please enter the correct number of winners.");
      return false;
    }
    if (maxTickets === undefined || maxTickets === 0) {
      errorAlert("Please enter the correct number of max tickets.");
      return false;
    }
    return true;
  };

  const updatePage = async () => {
    try {
      startLoading();
      const { image, name, description } = await getNFTdetail({
        wallet,
        mint: mint as string,
      });
      setImage(image);
      setNftName(name);
      setNftDescription(description);
    } catch (error) {
      console.error(error);
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    updatePage();
    // eslint-disable-next-line
  }, [wallet.connected]);
  return (
    <Box sx={{
      minHeight: 'calc(100vh - 80px)',
      p: 4,
      backgroundColor: "background.default",
      color: "text.primary",
    }}>
      <Container maxWidth='xl'>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4} xl={3}>
            <Card>
              <CardMedia>
                <Image src={image} showLoading={<Loading/>} alt="" />
              </CardMedia>
              <CardContent>
                <Box>
                  <Typography component="h5" sx={{
                    fontSize: "1rem",
                    fontWeight: 700,
                  }}>{t("RAFFLE.DETAILS.NAME")}</Typography>
                  <Typography component="p" sx={{
                    ml: 2,
                  }}>{nftName}</Typography>
                </Box>
                <Box>
                  <Typography component="h5" sx={{
                    fontSize: "1rem",
                    fontWeight: 700,
                  }}>{t("RAFFLE.DETAILS.DESC")}</Typography>
                  <Typography component="p" sx={{
                    ml: 2,
                  }}>{nftDescription}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={8} xl={9}>
            <Typography>{t('RAFFLE.ADMIN.CHOOSE_PAYMENT_METHOD')}</Typography>
            <FormControl>
              <RadioGroup row onChange={handlePayment} defaultValue="sol">
                <FormControlLabel
                  value="sol"
                  control={<Radio />}
                  label={DEFAULT_PAY_TYPE}
                />
                <FormControlLabel
                  value="spl"
                  control={<Radio />}
                  label={TOKEN_PAY_TYPE}
                />
              </RadioGroup>
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} sx={{
                my: 2
              }}>
                <Typography>{t('RAFFLE.ADMIN.PRICE')}</Typography>
                <Box sx={{
                  display: 'flex',
                }}>
                  <NumberInput className="number-control" name="price" value={price} onChange={(value?: number) => setPrice(value)} placeholder={t('RAFFLE.ADMIN.PRICE_PLACEHOLDER')}></NumberInput>
                  <Typography component="span">
                    {paymentMethod === "sol" ? (
                      <>{DEFAULT_PAY_TYPE}</>
                    ) : (
                      <>{TOKEN_PAY_TYPE}</>
                    )}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6} sx={{
                my: 2
              }}>
                <Typography>{t('RAFFLE.ADMIN.CHOOSE_REWARD_TYPE')}</Typography>
                <Box sx={{
                  display: 'flex',
                }}>
                  <FormControl>
                    <RadioGroup
                      row
                      onChange={handleRewardType}
                      defaultValue="nft"
                    >
                      <FormControlLabel
                        value="nft"
                        control={<Radio />}
                        label="NFT"
                      />
                      <FormControlLabel
                        value="whitelist"
                        control={<Radio />}
                        label="Whitelist"
                      />
                      <FormControlLabel
                        value="spl"
                        control={<Radio />}
                        label={TOKEN_PAY_TYPE}
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </Grid>
    <main>
      <div className="container">
        <div className="create-content">

          <div className="create-panel">
            <div className="row">
              {rewardType !== "nft" && (
                <div className="col-half">
                  <div className="form-control">
                    <label>Winner Count* (Maximum 50)</label>
                    <input
                      value={winnerCount}
                      name="winner-count"
                      onChange={(e: any) => setWinnerCount(e.target.value)}
                      placeholder="Please enter the winner count."
                    />
                  </div>
                </div>
              )}
              {rewardType === "spl" && (
                <div className="col-half">
                  <div className="form-control">
                    <label>Reward Price ({TOKEN_PAY_TYPE})</label>
                    <input
                      value={rewardPrice}
                      name="winner-count"
                      onChange={(e: any) => setRewardPrice(e.target.value)}
                      placeholder="Please enter the winner count."
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="row">
              <div className="col-half">
                <div className="form-control">
                  <label>End time*</label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    name="end-time"
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="Please choose end time."
                  />
                </div>
              </div>
              <div className="col-half">
                <div className="form-control">
                  <label>Tickets* (Maximum 2000)</label>
                  <input
                    value={maxTickets}
                    name="max-tickets"
                    onChange={(e: any) => setMaxTickets(e.target.value)}
                    placeholder="Please enter the max tickets."
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-half">
                <button
                  className="btn-main mt-10"
                  onClick={() => handleCreate()}
                >
                  Create a raffle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
        </Grid>
      </Container>
    </Box>
  );
}
