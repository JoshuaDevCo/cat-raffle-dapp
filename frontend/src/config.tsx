import { PublicKey } from "@solana/web3.js";
export const NETWORK = "mainnet-beta";
export const ADMINS = [
  {
    address: 'M1NXg8Vtwh8mbcY2g8zXJ3drqeueApjmVzHCxV6zy43',
  },
];

export const GLOBAL_AUTHORITY_SEED = "global-authority";

export const PROGRAM_ID = "2UJTYXzdemXUydQ9fxYD7ywQXbTGcXZUDcQNRe7khsTQ";
export const PREY_TOKEN_MINT = new PublicKey("AW2AKm8v7dGvUssdnAJ9Bbbb74t7JQNPDqGzgpDHH3e");
// export const PREY_TOKEN_MINT = new PublicKey("2Dm1zu8ERJGBs3NLXt8s8Vor3YHwJye5E2pYhLiMHU4L");
// nYDqQVEaQxLYLh8B8oAFXziMT1bcGrAVigZPL1s3dKc
export const RAFFLE_SIZE = 66544;
export const DECIMALS = 1000000000;
export const PREY_DECIMALS = 1000000000;

export const DEFAULT_PAY_TYPE = 'SOL'; // should not change
export const TOKEN_PAY_TYPE = '$PREY';

export const FLOATING_PTS_FIXED_DECIMAL = 2;

export const TOKEN_BUYING_HREF = 'https://'

export const DEBUG = 1;