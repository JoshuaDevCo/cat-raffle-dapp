import { PublicKey } from "@solana/web3.js";
// export const NETWORK = "mainnet-beta";
export const NETWORK = "mainnet-beta";
export const ADMINS = [
  {
    address: "M1NXg8Vtwh8mbcY2g8zXJ3drqeueApjmVzHCxV6zy43",
  },
  {
    address: "Auh2DLaxXjFAetZSTfZcMbZv8HPSmv1yziZPmaqnT7Qa",
  },
  {
    address: "3qWq2ehELrVJrTg2JKKERm67cN6vYjm1EyhCEzfQ6jMd"
  }
];

export const GLOBAL_AUTHORITY_SEED = "global-authority";

export const PROGRAM_ID = "CMty9AbXpbVnuQZ6q7NwPF13yTaBBrByL2K6bmsVTVgq";
export const PREY_TOKEN_MINT = new PublicKey(
  "7yDQ7h3WdytwjD64bwMQya6gW6kaqNj3fdjRY3MW9Rp8"
);
// export const PREY_TOKEN_MINT = new PublicKey("2Dm1zu8ERJGBs3NLXt8s8Vor3YHwJye5E2pYhLiMHU4L");
// nYDqQVEaQxLYLh8B8oAFXziMT1bcGrAVigZPL1s3dKc
export const RAFFLE_SIZE = 162544;
export const DECIMALS = 1000000000;
export const PREY_DECIMALS = 1000000000;

export const DEFAULT_PAY_TYPE = "SOL"; // should not change
export const TOKEN_PAY_TYPE = "$CAT";

export const FLOATING_PTS_FIXED_DECIMAL = 2;

export const TWITTER = "https://twitter.com/****";
export const DISCORD = "https://discord.com/****";

export const TOKEN_BUYING_HREF = "https://";

export const WHITELIST_MAX = 50;
export const TICKETS_MAX = 5000;

export const DEBUG = 0;
