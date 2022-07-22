import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { DECIMALS, DEFAULT_PAY_TYPE, TOKEN_PAY_TYPE } from "../config";
import { getRaffleState } from "../contexts/transaction";
import { NFTDetail } from "../contexts/type";
import { getNftMetaData } from "../contexts/utils";

export const getNFTdetail = async ({
  wallet,
  mint,
  raffleKey,
}: {
  wallet: any;
  mint: string;
  raffleKey?: string | string[];
}): Promise<NFTDetail> => {
  const result: any = {};
  if (!wallet || !mint) {
    return result;
  }
  const uri = await getNftMetaData(new PublicKey(mint));
  const resp = await fetch(uri);
  const json: any = await resp.json();
  result.image = json.image;
  result.name = json.name;
  result.description = json.description;
  if (raffleKey === undefined) {
    return result;
  }
  const raffleData = await getRaffleState(new PublicKey(mint));
  if (raffleData === null) return result;
  console.log(raffleData, "raffleData");
  const tickets = raffleData.count?.toNumber();
  const winnerCnt = raffleData.winnerCount.toNumber();
  let mine: any = [];
  for (let i = 0; i < tickets; i++) {
    if (raffleData.entrants[i].toBase58() === wallet.publicKey?.toBase58()) {
      mine.push({
        index: i + 1,
      });
    }
  }

  const winners = [];
  const resWinners = raffleData.winner;
  const claimedWinner = raffleData.claimedWinner;
  let claimed = 0;
  let isClaimed = false;
  let isWinner = false;
  for (let i = 0; i < winnerCnt; i++) {
    winners.push({
      address: resWinners[i].toBase58(),
      index: raffleData.indexes[i].toNumber(),
      claimed: claimedWinner[i].toNumber(),
    });

    if (
      resWinners[i].toBase58() === wallet.publicKey?.toBase58() &&
      claimedWinner[i].toNumber() === 1
    ) {
      claimed++;
      isClaimed = true;
    }

    if (
      wallet.publicKey !== null &&
      resWinners[i].toBase58() === wallet.publicKey?.toBase58()
    ) {
      isWinner = true;
    }
  }
  const allClaimed =
    winners
      .map((e: any) => e.claimed)
      .reduce((a: number, b: number) => a + b) === winnerCnt;

  result.raffleData = {
    tickets,
    end: raffleData.endTimestamp.toNumber() * 1000,
    wl: raffleData.whitelisted.toNumber(),
    price:
      raffleData.ticketPriceSol.toNumber() /
      (raffleData.ticketPricePrey.toNumber() === 0
        ? LAMPORTS_PER_SOL
        : DECIMALS),
    payType:
      raffleData.ticketPricePrey.toNumber() === 0
        ? DEFAULT_PAY_TYPE
        : TOKEN_PAY_TYPE,
    myTickets: mine,
    maxTickets: raffleData.maxEntrants.toNumber(),
    winnerCnt,
    isRevealed: !(
      raffleData.winner[0].toBase58() === "11111111111111111111111111111111"
    ),
    winners,
    isClaimed,
    isWinner,
    allClaimed,
  };
  return result;
};
