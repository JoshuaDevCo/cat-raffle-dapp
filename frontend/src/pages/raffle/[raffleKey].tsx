import { Box, Button, Card, CardContent, CardMedia, ClickAwayListener, Container, Grid, Input, Menu, MenuItem, Typography } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import moment from "moment";
import Image from "mui-image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TFunction } from "react-i18next";
import CopyAddress from "../../components/CopyAddress";
import Countdown from "../../components/Countdown";
import { NumberInput } from "../../components/NumberInput";
import { DEBUG, DEFAULT_PAY_TYPE, FLOATING_PTS_FIXED_DECIMAL } from "../../config";
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { startLoading, closeLoading, t } = props;
  const { raffleKey } = router.query;
  const [mint, setMint] = useState("");
  const [image, setImage] = useState("");
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [tickets, setTickets] = useState(1);
  const [isTicketsView, setIsTicketsView] = useState(false);
  const [raffleData, setRaffleData] = useState<NFTRaffleData>();

  const toFixed = (value: number) => value.toFixed(FLOATING_PTS_FIXED_DECIMAL);

  const counterUpdate = async () => {
    await updateNFTDetail();
  }

  const debugDataInject = () => {
    if (!DEBUG) return;
    setRaffleData({
      tickets: 248,
      end: moment().add('5','d').valueOf(),
      // end: moment().add('-5','d').valueOf(),
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
      isRevealed: true,
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

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 48px)',
      backgroundColor: "background.default",
      color: "text.primary",
      display: 'flex',
      alignItems: 'center',
      py: 2
    }}>
      <Container maxWidth='xl'>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Card sx={{
              borderRadius: 4
            }}>
              <CardMedia>
                <Image src={image || ''} showLoading alt="" />
              </CardMedia>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography component="h5" sx={{ fontSize: '1rem', fontWeight: 700 }}>{t('RAFFLE.DETAILS.NAME')}</Typography>
                  <Typography component="p" sx={{ ml:2 }}>{nftName}</Typography>
                </Box>
                <Box>
                  <Typography component="h5" sx={{ fontSize: '1rem', fontWeight: 700 }}>{t('RAFFLE.DETAILS.DESC')}</Typography>
                  <Typography component="p">{nftDescription}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={7} sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="h6" sx={{ fontSize: '0.875rem', fontWeight: 700 }}>{t('RAFFLE.DETAILS.PRICE')}</Typography>
                <Typography component="p">{raffleData?.price || 0} {raffleData?.payType || DEFAULT_PAY_TYPE}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography component="h6" sx={{ fontSize: '0.875rem', fontWeight: 700 }}>{t('RAFFLE.DETAILS.SOLD_TICKETS')}</Typography>
                <Typography component="p">{raffleData?.tickets || 0} / {raffleData?.maxTickets || 0}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                {wallet.publicKey !== null && 
                  <>
                    <Typography component="h6" sx={{ fontSize: '0.875rem', fontWeight: 700 }}>{t('RAFFLE.DETAILS.MY_TICKETS')}</Typography>
                    <Box sx={{ display: 'flex' }}>
                      <Typography component="p">{raffleData?.myTickets?.length}</Typography>
                      {raffleData?.myTickets?.length !== 0 && (
                        <Button variant="text" sx={{
                          textTransform: 'none',
                          color: 'text.primary',
                          p: 0,
                          fontWeight: 400,
                          fontSize: '0.875rem',
                          lineHeight: 1.5,
                          letterSpacing: '0.00938em',
                          alignItems: 'flex-start'
                        }}
                          onClick={(event) => {
                            setAnchorEl(event?.currentTarget);
                            setIsTicketsView(!isTicketsView);
                          }}
                        >
                          ({!isTicketsView ? "view" : "close"})
                        </Button>
                      )}
                      <Menu anchorEl={anchorEl} open={isTicketsView} onClose={() => {
                        setAnchorEl(null);
                        setIsTicketsView(false);
                      }}>
                        {raffleData?.myTickets?.length !== 0 &&
                          raffleData?.myTickets?.map(
                            (item: any, key: number) => (
                              <MenuItem key={key} sx={{ minWidth: 80 }}>#{item.index}</MenuItem>
                            )
                          )
                        }
                      </Menu>
                    </Box>
                  </>
                }
              </Grid>
              <Grid item xs={12} md={6}>
                {raffleData?.winnerCnt !== 1 && <>
                  <Typography component="h6" sx={{ fontSize: '0.875rem', fontWeight: 700 }}>{t('RAFFLE.DETAILS.WHITELIST_SPOTS')}</Typography>
                  <Typography component="p">{raffleData?.winnerCnt}</Typography>
                </>}
              </Grid>
              <Grid item xs={12} md={6}>
                  <Typography component="h6" sx={{ fontSize: '0.875rem', fontWeight: 700 }}>{t('RAFFLE.DETAILS.RAFFLE_ENDS')}</Typography>
                  {new Date() > new Date(raffleData?.end || 0) ? (
                    <Typography component="p">{t('RAFFLE.DETAILS.CLOSED')}</Typography>
                  ) : (
                    <Typography component="p" sx={{ fontSize: '1.5rem' }}>
                      <Countdown
                        endDateTime={new Date(raffleData?.end || 0)}
                        update={counterUpdate}
                      />
                    </Typography>
                  )}
              </Grid>
              <Grid item xs={12}>
                {wallet.publicKey === null ? (
                  <Typography component="p" sx={{
                    p: 2,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: '#32cbff55',
                    borderRadius: 2,
                    textAlign: 'center',
                    background: '#7e7eff40'
                  }}>{t('WALLET.PLEASE_CONNECT')}</Typography>
                ) : (
                  <>
                    {!isAdmin && new Date(raffleData?.end || 0) > new Date() && (
                      <Grid item xs={12} md={6}>
                        <Typography component="h6">{t('RAFFLE.DETAILS.TICKETS_TO_BUY.LABEL')}</Typography>
                        <NumberInput
                          id="tickets-to-buy"
                          name="tickets-to-buy"
                          defaultValue={1}
                          value={tickets}
                          min={1}
                          max={
                            (raffleData?.maxTickets || 0) -
                            (raffleData?.tickets || 0)
                          }

                          placeholder={t("RAFFLE.DETAILS.TICKETS_TO_BUY.PLACEHOLDER")}
                          onChange={(value: any) => setTickets(value)}
                        />
                        <Typography component="p" sx={{py: 1}}>
                          {t('RAFFLE.DETAILS.YOU_HAVE_TO_PAY')} {toFixed((raffleData?.price || 0) * tickets)} {raffleData?.payType}.
                        </Typography>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                    {isAdmin ? (
                      <>
                        {/* Reclaim nft when after endtime && no any tickets count  */}
                        {
                          new Date(raffleData?.end || 0) < new Date() &&
                          raffleData?.wl !== 3 &&
                          raffleData?.tickets === 0 &&
                          !raffleData?.isRevealed ? (
                            <Button
                              variant="contained"
                              sx={{ borderRadius: 2 }}
                              onClick={() => handleReClaim()}
                            >
                              {t('RAFFLE.DETAILS.ADMIN.RECLAIM')}
                            </Button>
                          ) : (
                            <></>
                          )
                        }
                        {raffleData?.allClaimed && (
                          <Button
                            variant="contained"
                            sx={{ borderRadius: 2 }}
                            onClick={() => handleClose()}
                          >
                            {t('RAFFLE.DETAILS.ADMIN.CLOSE')}
                          </Button>
                        )}
                      </>) : // On user side
                      // Before end time
                      new Date(raffleData?.end || 0) > new Date() ? (
                        <Button
                          variant="contained"
                          sx={{ borderRadius: 2 }}
                          onClick={() => handlePurchase()}
                        >
                          {t('RAFFLE.DETAILS.PURCHASE_TICKET')}
                        </Button>
                      ) : // After end time
                      // if is revealed winners
                      !raffleData?.isRevealed ? (
                        <>
                          {raffleData?.tickets !== 0 && (
                            <>
                              <Typography component="p" sx={{
                                p: 2,
                                mb: 2,
                                color: 'textColor.primary',
                                borderWidth: 1,
                                borderStyle: 'solid',
                                borderColor: '#f1d556',
                                backgroundColor: '#f1d55636',
                                borderRadius: 2
                              }}>
                                {t('WARNINGS.CANNOT_SEE_WINNER')}
                              </Typography>
                              <Button
                                variant="contained"
                                sx={{ borderRadius: 2 }}
                                onClick={() => handleRevealWinner()}
                              >
                                {t('RAFFLE.DETAILS.VIEW_WINNERS')}
                              </Button>
                            </>
                          )}
                        </>
                      ) : // else is revealed winners
                      !raffleData?.isClaimed && raffleData?.isWinner ? (
                        <Button
                          variant="contained"
                          sx={{ borderRadius: 2 }}
                          onClick={() => handleClaim()}
                        >
                          {t('RAFFLE.DETAILS.CLAIM')}
                        </Button>
                      ) : (
                        <></>
                      )}
                    </Grid>
                  </>
                )}
              </Grid>
              {raffleData?.winnerCnt !== 0 && raffleData?.isRevealed && (
                <Grid item xs={12}>
                  <Box sx={{ pt: 4 }}>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <>
                        {raffleData?.wl === 0 ? (
                          <Typography component="p" sx={{ fontSize: '1.5rem' }}>{t('RAFFLE.DETAILS.WINNER_LIST')}</Typography>
                        ) : (
                          <></>
                        )}
                        {raffleData?.wl === 1 ? (
                          <Typography component="p" sx={{ fontSize: '1.25rem' }}>{t('RAFFLE.DETAILS.WINNER')}</Typography>
                        ) : (
                          <></>
                        )}
                      </>
                      {
                        raffleData?.winners &&
                        raffleData?.winners.length !== 0 &&
                        raffleData?.winners.map((item: any, key: number) => (
                          <Box key={key} sx={{
                            py: 1,
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}>
                            <CopyAddress address={item.address} pipe={{ t }}/>
                            <Typography component="span" sx={{
                              width: 70,
                              ml: 1,
                              textAlign: 'center'
                            }}>
                              #&nbsp;{item.index}
                            </Typography>
                            <Typography component="span" sx={{
                              width: 70,
                              ml: 1,
                              textAlign: 'center'
                            }}>
                              {item.claimed === 1 ? t('RAFFLE.DETAILS.CLAIMED') : t('RAFFLE.DETAILS.NOT_YET_CLAIMED')}
                            </Typography>
                          </Box>
                        ))
                      }
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
