import { Box, Breakpoint, Container, Grid } from "@mui/material";
import { each } from "lodash";
import { useEffect, useState } from "react";
import { dashboard } from "../configs/dashboard";
import { getRaffleGlobalState } from "../contexts/transaction";
import { RaffleEntry } from "../contexts/type";
import RaffleCard from "./RaffleCard";

export default function RaffleList(props: any) {
  const [tab, setTab] = useState("live");
  const [liveRaffleList, setLiveRaffleList] = useState<any>();
  const [endRaffleList, setEndRaffleList] = useState<any>();
  const { startLoading, closeLoading, t, theme } = props;
  const getRaffleList = async () => {
    try {
      startLoading();
      const res = await getRaffleGlobalState();
      if (res !== undefined && res !== null && res?.length !== 0) {
        const liveList: Array<RaffleEntry> = [];
        const endList: Array<RaffleEntry> = [];
        each(res, (nft) => {
          if (nft !== null) {
            const ticketPricePrey = nft.ticketPricePrey.toNumber();
            const ticketPriceSol = nft.ticketPriceSol.toNumber();
            const endTimestamp = nft.endTimestamp.toNumber() * 1000;
            const nftMint = nft.nftMint.toBase58();
            const count = nft.count.toNumber();
            const maxEntrants = nft.maxEntrants.toNumber();
            const entry = {
              ticketPricePrey: ticketPricePrey,
              ticketPriceSol: ticketPriceSol,
              endTimestamp: endTimestamp,
              nftMint: nftMint,
              raffleKey: nft.raffleKey,
              ticketsCount: count,
              maxEntrants: maxEntrants,
            }
            if (new Date(endTimestamp) > new Date()) {
              liveList.push(entry);
            } else {
              endList.push(entry);
            }
          }
        }) 
        liveList.sort((a, b) => b.endTimestamp - a.endTimestamp);
        endList.sort((a, b) => b.endTimestamp - a.endTimestamp);
        setLiveRaffleList(liveList);
        setEndRaffleList(endList);
      }
    } catch (error) {
      console.error(error);
    } finally {
      closeLoading();
    }
    
  };

  useEffect(() => {
    getRaffleList();
    // eslint-disable-next-line
  }, []);
  const template = dashboard.raffleList;
  return (
    <Box sx={template.sx}>
      <Container maxWidth={template.maxWidth as Breakpoint}>
        <Grid container spacing={template.container}>
        {liveRaffleList !== undefined &&
          liveRaffleList.length !== 0 &&
          liveRaffleList.map(
            (item: any, key: number) =>
              tab === "live" && (
                <RaffleCard
                  key={key}
                  ticketPricePrey={item.ticketPricePrey}
                  ticketPriceSol={item.ticketPriceSol}
                  endTimestamp={item.endTimestamp}
                  nftMint={item.nftMint}
                  raffleKey={item.raffleKey}
                  maxEntrants={item.maxEntrants}
                  ticketsCount={item.ticketsCount}
                  pipe={{ startLoading, closeLoading, t, theme }}
                />
              )
          )}
        {endRaffleList !== undefined &&
          endRaffleList.length !== 0 &&
          endRaffleList.map(
            (item: any, key: number) =>
              tab === "live" && (
                <RaffleCard
                  key={key}
                  ticketPricePrey={item.ticketPricePrey}
                  ticketPriceSol={item.ticketPriceSol}
                  endTimestamp={item.endTimestamp}
                  raffleKey={item.raffleKey}
                  nftMint={item.nftMint}
                  maxEntrants={item.maxEntrants}
                  ticketsCount={item.ticketsCount}
                  pipe={{ startLoading, closeLoading, t, theme }}
                />
              )
          )}
        </Grid>
      </Container>
    </Box>
  );
}
