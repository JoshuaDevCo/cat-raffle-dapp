import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { DECIMALS, DEFAULT_PAY_TYPE, TOKEN_BUYING_HREF, TOKEN_PAY_TYPE } from "../config";
import { getNftMetaData } from "../contexts/utils";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "mui-image";
import { Loading } from "./Loading";
import { Box, Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import Countdown from "./Countdown";

export default function RaffleCard(props: {
  ticketPricePrey: number;
  ticketPriceSol: number;
  endTimestamp: number;
  ticketsCount: number;
  nftMint: string;
  raffleKey: string;
  maxEntrants: number;
  pipe: any,
}) {
  const {
    ticketPricePrey,
    ticketPriceSol,
    maxEntrants,
    raffleKey,
    endTimestamp,
    nftMint,
    ticketsCount,
    pipe
  } = props;
  const router = useRouter();
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [payType, setPayType] = useState("--");
  const { t } = pipe;

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
    <Grid item xs={12} md={6} lg={4} xl={3}>
      <Card sx={{
        borderRadius: 12,
        backgroundColor: 'background.primary',
        cursor: 'pointer',
      }}
      className="raffle-card"
      onClick={() => router.push("/raffle/" + raffleKey)}>
        <CardMedia>
          <Image src={image} alt="" showLoading={<Loading/>}
            style={{
              filter:
                endTimestamp < new Date().getTime() ? "grayscale(1)" : "none",
            }}>
          </Image>
        </CardMedia>
        <CardContent sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }} className="card-content">
          <Box>
            <Typography component="h3" sx={{ fontSize: '1.5rem' }}>{name}</Typography>
          </Box>
          <Box>
            <Typography component="p" sx={{
              py: 1,
              fontSize: '1rem',
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: 'text.primary',
              textAlign: 'center',
              borderRadius: 8,
              fontWeight: 700,
              my: 1,
            }}>{price} {payType}</Typography>
          </Box>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            my: 1,
          }}>
            {endTimestamp > new Date().getTime() ? (
              <>
                <Typography component="p" sx={{ fontWeight: 700 }}>{t('RAFFLE.DETAILS.END_IN')}</Typography>
                <Countdown
                  endDateTime={endTimestamp}
                  update={() => getNFTdetail()}
                />
              </>
            ) : (
              <>{t('RAFFLE.DETAILS.CLOSED')}</>
            )}
          </Box>
          <Box sx={{
            fontSize: '1rem',
            textAlign: 'end',
            fontWeight: 600,
          }}>
            <Typography component="span" sx={{
              fontSize: '1.25rem',
              fontWeight: 700,
            }}>{ticketsCount} / {maxEntrants} {t('RAFFLE.DETAILS.FILLED')}</Typography>
          </Box>
          <Box>
            <Typography component="p" sx={{
              fontSize: '0.875rem',
              fontWeight: 'bold',
              lineHeight: 1.5,
              color: '#777',
              minHeight: 115
            }}>
              {description.slice(0, 120)}
              {description.length > 10 && "..."}
              {description.length > 10 && (
                <Typography component="a" sx={{
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                  ml: 1,
                  textDecoration: 'none',
                  href: "/raffle/" + raffleKey
                }}>{t('RAFFLE.DETAILS.READ_MORE')}</Typography>
              )}
            </Typography>
          </Box>
          <Box sx={{
            mt: 2,
          }}>
            <Typography component="p" sx={{
              textTransform: 'uppercase',
              fontWeight: 700,
              fontSize: '0.875rem'
            }}>
              {t('RAFFLE.DETAILS.NOT_ENOUGH_TOKEN')}
              <Typography component="a" href={TOKEN_BUYING_HREF} sx={{
                textDecoration: 'none',
                ml: 1,
              }}>{t('RAFFLE.DETAILS.HERE')}</Typography>
            </Typography>
          </Box>
        </CardContent>
        
      </Card>
    </Grid>
  );
}
