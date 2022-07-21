import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import moment from "moment";
import { createRaffle } from "../../../contexts/transaction";
import { errorAlert } from "../../../components/toastGroup";
import { getNFTdetail } from "../../../services/fetchData";
import Image from "mui-image";
import { DEFAULT_PAY_TYPE, TOKEN_PAY_TYPE } from "../../../config";

export default function CreateNewRafflePage(props: {
  startLoading: Function;
  closeLoading: Function;
}) {
  const { startLoading, closeLoading } = props;
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
  const [price, setPrice] = useState();
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
            <div className="row">
              <div className="col-half">
                <div className="form-control">
                  <label>Choose payment method</label>
                  <FormControl>
                    <RadioGroup row onChange={handlePayment} defaultValue="sol">
                      <FormControlLabel
                        value="sol"
                        control={<Radio />}
                        label="SOL"
                      />
                      <FormControlLabel
                        value="spl"
                        control={<Radio />}
                        label="$PREY"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
              <div className="col-half">
                <div className="form-control">
                  <label>Price*</label>
                  <input
                    value={price}
                    name="price"
                    onChange={(e: any) => setPrice(e.target.value)}
                    placeholder="Please enter the NFT price"
                  />
                  <span className="token-name">
                    {paymentMethod === "sol" ? (
                      <>{DEFAULT_PAY_TYPE}</>
                    ) : (
                      <>{TOKEN_PAY_TYPE}</>
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-half">
                <div className="form-control">
                  <label>Choose reward type</label>
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
                        label="PREY"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
            </div>
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
  );
}
