import { ClickAwayListener } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import Image from "mui-image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CopyAddress from "../../components/CopyAddress";
import Countdown from "../../components/Countdown";
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
}) {
  const wallet = useWallet();
  const router = useRouter();
  const { startLoading, closeLoading } = props;
  const { raffleKey } = router.query;
  const [mint, setMint] = useState("");
  const [image, setImage] = useState("");
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [tickets, setTickets] = useState(1);
  const [isTicketsView, setIsTicketsView] = useState(false);
  const [raffleData, setRaffleData] = useState<NFTRaffleData>();

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
    <main>
      <div className="container">
        <div className="create-content">
          <div className="nft-info">
            <div className="media">
              <Image src={image} showLoading alt="" />
            </div>
            <div className="info-item">
              <label>Name: </label>
              <h2>{nftName}</h2>
            </div>
            <div className="info-item">
              <label>Description: </label>
              <p className="description">{nftDescription}</p>
            </div>
          </div>

          <div className="create-panel">
            <div className="row m-20">
              <div className="col-12">
                <div className="raffle-info-item">
                  <label>Price</label>
                  <p className="text-1">
                    {raffleData?.price} {raffleData?.payType}
                  </p>
                </div>
              </div>
            </div>
            <div className="row m-20">
              <div className="col-half">
                <div className="raffle-info-item">
                  <label>Sold tickets</label>
                  <p className="text-2">
                    {raffleData?.tickets} / {raffleData?.maxTickets}
                  </p>
                </div>
              </div>
              {wallet.publicKey !== null && (
                <div className="col-half">
                  <div className="raffle-info-item">
                    <label>My tickets</label>
                    <div className="text-2 my-tickets">
                      <span>{raffleData?.myTickets?.length}</span>
                      {raffleData?.myTickets?.length !== 0 && (
                        <span
                          className="view-tickets"
                          onClick={() => setIsTicketsView(!isTicketsView)}
                        >
                          {!isTicketsView ? "view" : "close"}
                        </span>
                      )}
                      {isTicketsView && (
                        <ClickAwayListener
                          onClickAway={() => setIsTicketsView(false)}
                        >
                          <div className="my-tickets-content">
                            <ul>
                              {raffleData?.myTickets?.length !== 0 &&
                                raffleData?.myTickets?.map(
                                  (item: any, key: number) => (
                                    <li key={key}>#{item.index}</li>
                                  )
                                )}
                            </ul>
                          </div>
                        </ClickAwayListener>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="row m-20">
              {raffleData?.winnerCnt !== 1 && (
                <div className="col-half">
                  <div className="raffle-info-item">
                    <label>Whitelist Spots</label>
                    <p className="text-2">{raffleData?.winnerCnt}</p>
                  </div>
                </div>
              )}
              <div className="col-half">
                <div className="raffle-info-item">
                  <label>Raffle Ends</label>
                  {new Date() > new Date(raffleData?.end || 0) ? (
                    <p className="text-2">Closed</p>
                  ) : (
                    <p className="text-2">
                      <Countdown
                        endDateTime={new Date(raffleData?.end || 0)}
                        update={updateNFTDetail()}
                      />
                    </p>
                  )}
                </div>
              </div>
            </div>
            {wallet.publicKey === null ? (
              <p className="wallet-alert">Please connect wallet</p>
            ) : (
              <>
                {!isAdmin && new Date(raffleData?.end || 0) > new Date() && (
                  <div className="row m-20">
                    <div className="col-half">
                      <div className="form-control">
                        <label>Tickets to buy*</label>
                        <input
                          type="number"
                          value={tickets}
                          name="end-time"
                          min={1}
                          max={
                            (raffleData?.maxTickets || 0) -
                            (raffleData?.tickets || 0)
                          }
                          onChange={(e: any) => setTickets(e.target.value)}
                          placeholder="Please choose end time."
                        />
                        <p>
                          You have to pay {(raffleData?.price || 0) * tickets}{" "}
                          {raffleData?.payType}.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="row m-10">
                  <div className="col-12">
                    {isAdmin ? (
                      <>
                        {/* Reclaim nft when after endtime && no any tickets count  */}
                        {new Date(raffleData?.end || 0) < new Date() &&
                        raffleData?.wl !== 3 &&
                        raffleData?.tickets === 0 &&
                        !raffleData?.isRevealed ? (
                          <button
                            className="btn-create-aution"
                            onClick={() => handleReClaim()}
                          >
                            Reclaim
                          </button>
                        ) : (
                          <></>
                        )}
                        {raffleData?.allClaimed && (
                          <button
                            className="btn-create-aution"
                            onClick={() => handleClose()}
                          >
                            Close
                          </button>
                        )}
                      </>
                    ) : // On user side
                    // Before end time
                    new Date(raffleData?.end || 0) > new Date() ? (
                      <button
                        className="btn-create-aution"
                        onClick={() => handlePurchase()}
                      >
                        purchase ticket
                      </button>
                    ) : // After end time
                    // if is revealed winners
                    !raffleData?.isRevealed ? (
                      <>
                        {raffleData?.tickets !== 0 && (
                          <>
                            <p className="reveal-alert">
                              You cannot see the winners at this time. You must
                              pay a transaction fee to see the winner.
                            </p>
                            <button
                              className="btn-create-aution"
                              onClick={() => handleRevealWinner()}
                            >
                              view winners
                            </button>
                          </>
                        )}
                      </>
                    ) : // else is revealed winners
                    !raffleData?.isClaimed && raffleData?.isWinner ? (
                      <button
                        className="btn-create-aution"
                        onClick={() => handleClaim()}
                      >
                        claim
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </>
            )}
            {raffleData?.winnerCnt !== 0 && raffleData?.isRevealed && (
              <div className="row m-10">
                <div className="col-12">
                  <div className="winner-list">
                    <div className="winner-content">
                      <>
                        {raffleData?.wl === 0 ? (
                          <p className="text-1">Winner List</p>
                        ) : (
                          <></>
                        )}
                        {raffleData?.wl === 1 ? (
                          <p className="text-2">Winner</p>
                        ) : (
                          <></>
                        )}
                      </>
                      {raffleData?.winners &&
                        raffleData?.winners.length !== 0 &&
                        raffleData?.winners.map((item: any, key: number) => (
                          <div className="winner-item" key={key}>
                            <CopyAddress address={item.address} />
                            <span className="winner-claimed">
                              #&nbsp;{item.index}
                            </span>
                            <span className="winner-claimed">
                              {item.claimed === 1 ? "Claimed" : "---"}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
