import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import { createRaffle } from "../../../contexts/transaction";
import { errorAlert } from "../../../components/toastGroup";
import { getNFTdetail } from "../../../services/fetchData";
import Image from "mui-image";
import { DEFAULT_PAY_TYPE, TICKETS_MAX, TOKEN_PAY_TYPE, WHITELIST_MAX } from "../../../config";
import { Loading } from "../../../components/Loading";
import { TFunction } from "react-i18next";
import { NumberInput } from "../../../components/NumberInput";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";

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
  const [price, setPrice] = useState(0);
  const [maxTickets, setMaxTickets] = useState(TICKETS_MAX);
  const [endTime, setEndTime] = useState(moment(new Date()).format('YYYY-MM-DDTHH:mm'));

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
                <Box sx={{ display: 'flex' }}>
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
                  <Typography component="p">{nftDescription}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={8} xl={9} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
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
                  alignItems: 'center'
                }}>
                  <NumberInput className="number-control" name="price" value={price} min={0.01} step={0.01} precision={2}
                    onChange={(value?: number) => {
                      if (!value) return;
                      if (value >= 0.01) {
                        setPrice(value)
                      }
                    }}
                    placeholder={t('RAFFLE.ADMIN.PRICE_PLACEHOLDER')}></NumberInput>
                  <Typography component="span" sx={{ marginLeft: '-70px' }}>
                    {paymentMethod === "sol" ? DEFAULT_PAY_TYPE : TOKEN_PAY_TYPE }
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
              {rewardType !== "nft" && <Grid item xs={12} md={6}>
                <Typography>{t('RAFFLE.ADMIN.WINNER_COUNT')} {WHITELIST_MAX})</Typography>
                <NumberInput className="number-control" name="winner-count" value={winnerCount} min={1} max={WHITELIST_MAX} step={1} precision={0}
                  onChange={(value?: number) => {
                    if (!value) return;
                    if (value >= 1 && value <= WHITELIST_MAX) {
                      setWinnerCount(value)
                    }
                  }}
                  placeholder={t('RAFFLE.ADMIN.WINNER_COUNT_PLACEHOLDER')}></NumberInput>
              </Grid>}

              {rewardType === "spl" && <Grid item xs={12} md={6}>
                <Typography>{t('RAFFLE.ADMIN.REWARD_PRICE')} ({TOKEN_PAY_TYPE})</Typography>
                <NumberInput className="number-control" name="reward-price" value={rewardPrice} min={0.01} step={0.01} precision={2}
                  onChange={(value?: number) => {
                    if (!value) return;
                    if (value >= 0.01) {
                      setRewardPrice(value)
                    }
                  }}
                  placeholder={t('RAFFLE.ADMIN.REWARD_PRICE_PLACEHOLDER')}></NumberInput>
              </Grid>}

              <Grid item xs={12} md={6}>
                <Typography>{t('RAFFLE.ADMIN.END_TIME')}</Typography>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    value={endTime}
                    onChange={(value: any, keyboardInputValue?: string | undefined) => {
                      setEndTime(value?.format('YYYY-MM-DDTHH:mm') ?? "");
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography>{t('RAFFLE.ADMIN.MAX_TICEKTS')} {TICKETS_MAX})</Typography>
                <NumberInput className="number-control" name="max-tickets" value={maxTickets} min={1} max={TICKETS_MAX} step={1} precision={0}
                  onChange={(value?: number) => {
                    if (!value) return;
                    if (value >= 1 && value <= TICKETS_MAX) {
                      setMaxTickets(value)
                    }
                  }}
                  placeholder={t('RAFFLE.ADMIN.MAX_TICEKTS_PLACEHOLDER')}></NumberInput>
              </Grid>

              <Grid item xs={12}>
                <Button color="primary" variant="contained" sx={{ width: '100%', mt: 2 }}
                  onClick={() => handleCreate()}>
                  {t('RAFFLE.ADMIN.CREATE_THE_RAFFLE')}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
