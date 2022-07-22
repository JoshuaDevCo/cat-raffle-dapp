import { Box, Container, Grid } from "@mui/material";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import Promise from "bluebird";
import { filter } from "lodash";
import { useEffect, useState } from "react";
import { TFunction } from "react-i18next";
import ReadyCard from "../components/ReadyCard";
import { getNftMetaData, solConnection } from "../contexts/utils";

export default function CreateRaffle(props: {
  startLoading: Function;
  closeLoading: Function;
  t: TFunction;
}) {
  const { startLoading, closeLoading, t } = props;

  const wallet = useWallet();
  const [hide, setHide] = useState(false);
  const [nftList, setNftList] = useState<any>();

  const getNFTs = async () => {
    if (wallet.publicKey === null) {
      return;
    }
    try {
      startLoading(true);
      const nftsList = await getParsedNftAccountsByOwner({
        publicAddress: wallet.publicKey.toBase58(),
        connection: solConnection,
      });
      const nftItemList = await Promise.mapSeries(nftsList, async item => {
        const { mint } = item;
        try {
          const uri = await getNftMetaData(new PublicKey(mint));
          const resp = await fetch(uri);
          const json = await resp.json();
          const { image, name } = json;
          return { mint, image, name };
        } catch (error) {
          console.error(error);
        }
      })
      setNftList(filter(nftItemList, item => !!item));
      setHide(!hide);
    } catch (error) {
      console.error(error);
    } finally {
      closeLoading(false);
    }
  };

  useEffect(() => {
    if (wallet.publicKey !== null) {
      getNFTs();
    } else {
      setNftList([]);
    }
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
          {nftList &&
            nftList.length !== 0 &&
            nftList.map((item: { mint: string, name: string, image: string }, key: number) => (
              <ReadyCard mint={item.mint} name={item.name} image={item.image} key={key} pipe={{ t }} />
            ))
          }
          <Grid item xl={12}>
            {nftList && nftList.length === 0 && (
              <p className="empty-wallet">{t('WALLET.EMPTY')}</p>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
