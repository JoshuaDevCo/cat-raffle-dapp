# Apex | NFT Raffle Solana

## Requirements

### Payment method

- SOL
- $PREY (SPL token)

### Reward Type

- Reveive NFT
- Whitelist
- Tickets
- Reward Token

## Development

```bash
npm run dev
# or
yarn dev
```

### Install

```bash
npm install
# or
yarn install
```

### Problem Solved

- Pending transaction confirmed

```javascript
-(await solConnection.confirmTransaction(tx, "confirmed"));

+(await solConnection.confirmTransaction(tx, "finalized"));
```

## Configurable items

There are serveral configurable items in this project and those configs are located at `config.tsx` and inside `src/configs` folder.

### `config.tsx`

#### config the mainnet, admins and fellows contract information.

```ts
export const NETWORK = "devnet";
export const ADMINS = [
  {
    address: "M1NXg8Vtwh8mbcY2g8zXJ3drqeueApjmVzHCxV6zy43",
  },
];

export const GLOBAL_AUTHORITY_SEED = "global-authority";

export const PROGRAM_ID = "2UJTYXzdemXUydQ9fxYD7ywQXbTGcXZUDcQNRe7khsTQ";
export const PREY_TOKEN_MINT = new PublicKey(
  "AW2AKm8v7dGvUssdnAJ9Bbbb74t7JQNPDqGzgpDHH3e"
);
// export const PREY_TOKEN_MINT = new PublicKey("2Dm1zu8ERJGBs3NLXt8s8Vor3YHwJye5E2pYhLiMHU4L");
// nYDqQVEaQxLYLh8B8oAFXziMT1bcGrAVigZPL1s3dKc
export const RAFFLE_SIZE = 66544;
export const DECIMALS = 1000000000;
export const PREY_DECIMALS = 1000000000;

export const DEFAULT_PAY_TYPE = "SOL"; // should not change
export const TOKEN_PAY_TYPE = "$PREY";

export const FLOATING_PTS_FIXED_DECIMAL = 2;
```

#### Config project specific information for UI

Twitter and Discord link

```ts
export const TWITTER = "https://twitter.com/****";
export const DISCORD = "https://discord.com/****";
```

Token buying site, whitelist maximum and tickets maximum

```ts
export const TOKEN_BUYING_HREF = "https://";

export const WHITELIST_MAX = 50;
export const TICKETS_MAX = 2000;
```

### `src/configs`

To config the UI layout, we can customize the header, the dashboard, the NFT card, and the Staking Dialog as well as the `i18n` text used in the pages.

#### `./header.ts`

For the header layout customization, we can use a template format to define the content inside the `AppBar` (component in MUI). Please view the `TemplateItem` section for details.

Example:

```ts
export const header = {
  position: "static",
  maxWidth: "xl",
  disableGutters: true,
  color: "transparent",
  items: [
    {
      type: "box",
      sx: {
        flexGrow: 1,
        display: {
          xs: "flex",
          md: "none",
        },
      },
      items: [
        {
          type: "iconButton",
          size: "large",
          color: "inherit",
          iconColor: "#808080",
          icon: "MenuIcon",
          onClick: handleOpenNavMenu,
        },
        {
          type: "menu",
          id: "menu-appbar",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          keepMounted: true,
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
          onClose: handleCloseNavMenu,
          sx: {
            display: { xs: "block", md: "none" },
          },
          items: [
            {
              type: "menuItem",
              items: [
                {
                  type: "typography",
                  label: "MENU.HOME",
                  textAlign: "center",
                  noWrap: true,
                  component: "a",
                  sx: {
                    px: 2,
                    textDecoration: "none",
                    color: "text.primary",
                  },
                  href: "/",
                },
              ],
            },
            {
              type: "menuItem",
              hidden: ({ isAdmin }: any) => !isAdmin,
              items: [
                {
                  type: "typography",
                  label: "MENU.CREATE",
                  textAlign: "center",
                  noWrap: true,
                  component: "a",
                  sx: {
                    px: 2,
                    textDecoration: "none",
                    color: "text.primary",
                  },
                  className: ({ routerName, theme }: any) =>
                    routerName === "create-raffle"
                      ? `active ${theme.palette.mode}`
                      : `${theme.palette.mode}`,
                  href: "/create-raffle",
                },
              ],
            },
            {
              type: "menuItem",
              items: [
                {
                  type: "typography",
                  label: "MENU.RAFFLE_HOUSE",
                  textAlign: "center",
                  noWrap: true,
                  component: "a",
                  sx: {
                    px: 2,
                    textDecoration: "none",
                    color: "text.primary",
                  },
                  className: ({ routerName, theme }: any) =>
                    routerName === "raffle"
                      ? `active ${theme.palette.mode}`
                      : `${theme.palette.mode}`,
                  href: "/",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "grid",
      spacing: 2,
      sx: {
        justifyContent: "flex-end",
      },
      items: [
        {
          type: "gridItem",
          xs: 4,
          md: 8,
          sx: {
            display: { xs: "none", md: "flex" },
            alignItems: "center",
          },
          items: [
            {
              type: "image",
              image: "/img/logo.png",
              width: 64,
              height: 64,
              alt: "",
            },
            {
              type: "typography",
              variant: "h6",
              noWrap: true,
              component: "a",
              href: "/",
              sx: {
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "text.primary",
                textDecoration: "none",
              },
              label: "TITLE",
            },
            {
              type: "typography",
              label: "MENU.CREATE",
              textAlign: "center",
              noWrap: true,
              component: "a",
              sx: {
                px: 2,
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "text.primary",
                textDecoration: "none",
              },
              hidden: ({ isAdmin }: any) => !isAdmin,
              className: ({ routerName, theme }: any) =>
                routerName === "create-raffle"
                  ? `active ${theme.palette.mode}`
                  : "",
              href: "/create-raffle",
            },
            {
              type: "typography",
              label: "MENU.RAFFLE_HOUSE",
              textAlign: "center",
              noWrap: true,
              component: "a",
              sx: {
                px: 2,
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "text.primary",
                textDecoration: "none",
              },
              className: ({ routerName, theme }: any) =>
                routerName === "raffle" ? `active ${theme.palette.mode}` : "",
              href: "/",
            },
          ],
        },
        {
          type: "gridItem",
          xs: 8,
          md: 4,
          sx: {
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          },
          items: [
            {
              type: "toggleColorButton",
              iconColor: "#808080",
              sx: {
                mr: 2,
              },
            },
            {
              type: "iconButton",
              icon: "TwitterIcon",
              iconColor: "#808080",
              sx: {
                mr: 2,
              },
              onClick: handleTwitterClick,
            },
            {
              type: "iconButton",
              icon: "DiscordIcon",
              iconColor: "#808080",
              sx: {
                mr: 2,
              },
              onClick: handleDiscordClick,
            },
            {
              type: "wallet",
              variant: "outlined",
              sx: {
                borderRadius: 5000,
              },
            },
          ],
        },
      ],
    },
  ],
};
```

#### `./dashboard.ts`

For the upper part of the layout in the body, we can use a template format to define the content inside the `Container`. Please view the `TemplateItem` section for details.
`banner` is for the setting of the main banner
`raffleList` is for the setting of the raffles cards list

`dashboard` Example:

```ts
export const dashboard = {
  maxWidth: "xl",
  className: "dashboard-container",
  sx: {
    p: 4,
    backgroundColor: "background.default",
    color: "text.primary",
  },
  banner: {
    imageHeight: 240,
    fit: "contain",
    src: "/img/hero-banner.png",
    href: "/",
    sx: {
      mx: "auto",
    },
    hidden: false,
  },
  raffleList: {
    sx: {
      backgroundColor: "background.default",
      color: "text.primary",
      display: "flex",
      alignItems: "center",
      py: 2,
    },
    maxWidth: "xl",
    container: {
      spacing: 3,
    },
  },
};
```

#### `./raffleCard.ts`

To config the layout for Raffle card, we can use a template format to define the content. Please view the `TemplateItem` section for details.

Raffle Card:

```ts
export const raffleCard = ({
  raffleKey,
  image,
  endTimestamp,
  name,
  price,
  payType,
  ticketsCount,
  maxEntrants,
  description,
}: any) => ({
  type: "gridItem",
  xs: 12,
  md: 6,
  lg: 4,
  xl: 3,
  items: [
    {
      type: "card",
      sx: {
        borderRadius: 12,
        backgroundColor: "background.primary",
        cursor: "pointer",
      },
      className: "raffle-card",
      onClick: (event: any, { router }: any) =>
        router.push("/raffle/" + raffleKey),
      image,
      alt: "",
      showLoading: true,
      imageStyle: {
        filter: endTimestamp < new Date().getTime() ? "grayscale(1)" : "none",
      },
      contentSx: {
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      },
      items: [
        {
          type: "box",
          items: [
            {
              type: "typography",
              component: "h3",
              sx: {
                fontSize: "1.5rem",
              },
              label: name,
            },
          ],
        },
        {
          type: "box",
          items: [
            {
              type: "typography",
              component: "p",
              sx: {
                py: 1,
                fontSize: "1rem",
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: "text.primary",
                textAlign: "center",
                borderRadius: 8,
                fontWeight: 700,
                my: 1,
              },
              label: `${price} ${payType}`,
            },
          ],
        },
        {
          type: "box",
          sx: {
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            my: 1,
          },
          items: [
            {
              hidden: endTimestamp > new Date().getTime(),
              type: "typography",
              label: "RAFFLE.DETAILS.CLOSED",
            },
            {
              hidden: !(endTimestamp > new Date().getTime()),
              type: "empty",
              items: [
                {
                  type: "typography",
                  component: "p",
                  sx: { fontWeight: 700 },
                  label: "RAFFLE.DETAILS.END_IN",
                },
                {
                  type: "countdown",
                  component: "p",
                  sx: { fontSize: "1.5rem" },
                  update: ({ counterUpdate }: any) => counterUpdate(),
                  endDateTime: endTimestamp,
                },
              ],
            },
          ],
        },
        {
          type: "box",
          sx: {
            fontSize: "1rem",
            textAlign: "end",
            fontWeight: 600,
          },
          items: [
            {
              type: "typography",
              component: "span",
              sx: {
                fontSize: "1.25rem",
                fontWeight: 700,
              },
              label: ({ t }: any) =>
                `${ticketsCount} / ${maxEntrants} ${t(
                  "RAFFLE.DETAILS.FILLED"
                )}`,
            },
          ],
        },
        {
          type: "box",
          items: [
            {
              type: "typography",
              component: "p",
              sx: {
                fontSize: "0.875rem",
                fontWeight: "bold",
                lineHeight: 1.5,
                color: "#777",
              },
              label: `${description.slice(0, 120)} ${
                description.length > 120 ? "..." : ""
              }`,
              items: [
                {
                  hidden: !(description.length > 120),
                  type: "typography",
                  component: "a",
                  sx: {
                    textTransform: "uppercase",
                    color: "text.secondary",
                    ml: 1,
                    textDecoration: "none",
                  },
                  href: "/raffle/" + raffleKey,
                  label: "RAFFLE.DETAILS.READ_MORE",
                },
              ],
            },
          ],
        },
        {
          type: "box",
          sx: {
            mt: 2,
          },
          items: [
            {
              type: "typography",
              component: "p",
              sx: {
                textTransform: "uppercase",
                fontWeight: 700,
                fontSize: "0.875rem",
              },
              label: "RAFFLE.DETAILS.NOT_ENOUGH_TOKEN",
              items: [
                {
                  type: "typography",
                  component: "a",
                  href: TOKEN_BUYING_HREF,
                  sx: {
                    textDecoration: "none",
                    ml: "4px",
                    fontSize: "0.875rem",
                    color: "text.primary",
                    fontWeight: 700,
                  },
                  label: "RAFFLE.DETAILS.HERE",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});
```

#### `./raffleDetail.ts`

To config the layout for raffle detail page, we can use a template format to define the content. Please view the `TemplateItem` section for details.

Example:

```ts
export const raffleDetail = ({ name, description }: any) => ({
  sx: {
    minHeight: "calc(100vh - 80px)",
    backgroundColor: "background.default",
    color: "text.primary",
    display: "flex",
    alignItems: "center",
    py: 2,
  },
  maxWidth: "xl",
  spacing: 3,
  cardView: {
    type: "gridItem",
    xs: 12,
    md: 5,
    sx: {
      borderRadius: 4,
    },
    showLoading: true,
    alt: "",
    items: [
      {
        type: "box",
        sx: {
          display: "flex",
          alignItems: "center",
        },
        items: [
          {
            type: "typography",
            component: "h5",
            sx: {
              fontSize: "1rem",
              fontWeight: 700,
            },
            label: "RAFFLE.DETAILS.NAME",
          },
          {
            type: "typography",
            component: "p",
            sx: {
              ml: 2,
            },
            label: name,
          },
        ],
      },
      {
        type: "box",
        sx: {
          display: "flex",
          alignItems: "center",
        },
        items: [
          {
            type: "typography",
            component: "h5",
            sx: {
              fontSize: "1rem",
              fontWeight: 700,
            },
            label: "RAFFLE.DETAILS.DESC",
          },
          {
            type: "typography",
            component: "p",
            sx: {
              ml: 2,
            },
            label: description,
          },
        ],
      },
    ],
  },
  gridCols: [
    {
      xs: 12,
      md: 7,
      sx: {
        display: "flex",
        alignItems: "flex-end",
      },
      items: [
        {
          type: "grid",
          spacing: 2,
          items: [
            {
              type: "gridItem",
              xs: 12,
              items: [
                {
                  type: "typography",
                  component: "h6",
                  sx: {
                    fontSize: "0.875rem",
                    fontWeight: 700,
                  },
                  label: "RAFFLE.DETAILS.PRICE",
                },
                {
                  type: "typography",
                  component: "p",
                  label: ({ raffleData }: any) =>
                    `${raffleData?.price || 0} ${
                      raffleData?.payType || DEFAULT_PAY_TYPE
                    }`,
                },
              ],
            },
            {
              type: "gridItem",
              xs: 12,
              md: 6,
              items: [
                {
                  type: "typography",
                  component: "h6",
                  sx: {
                    fontSize: "0.875rem",
                    fontWeight: 700,
                  },
                  label: "RAFFLE.DETAILS.SOLD_TICKETS",
                },
                {
                  type: "typography",
                  component: "p",
                  label: ({ raffleData }: any) =>
                    `${raffleData?.tickets || 0} / ${
                      raffleData?.maxTickets || 0
                    }`,
                },
              ],
            },
            {
              type: "gridItem",
              xs: 12,
              md: 6,
              hidden: ({ wallet }: any) => wallet.publicKey === null,
              items: [
                {
                  type: "typography",
                  component: "h6",
                  sx: {
                    fontSize: "0.875rem",
                    fontWeight: 700,
                  },
                  label: "RAFFLE.DETAILS.MY_TICKETS",
                },
                {
                  type: "box",
                  sx: {
                    display: "flex",
                  },
                  items: [
                    {
                      type: "typography",
                      component: "p",
                      label: ({ raffleData }: any) =>
                        `${raffleData?.myTickets?.length}`,
                    },
                    {
                      type: "menuButton",
                      variant: "text",
                      sx: {
                        textTransform: "none",
                        color: "text.primary",
                        p: 0,
                        fontWeight: 400,
                        fontSize: "0.875rem",
                        lineHeight: 1.5,
                        letterSpacing: "0.00938em",
                        alignItems: "flex-start",
                      },
                      hidden: ({ raffleData }: any) =>
                        raffleData?.myTickets?.length === 0,
                      label: ({ isTicketsView }: any) =>
                        !isTicketsView
                          ? "RAFFLE.DETAILS.VIEW"
                          : "RAFFLE.DETAILS.CLOSE",
                      items: [
                        {
                          type: "menuItemList",
                          dataPath: "raffleData.myTickets",
                          sx: { minWidth: 80 },
                          label: ({ item }: any) => `#${item.index}`,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: "gridItem",
              xs: 12,
              md: 6,
              items: [
                {
                  type: "empty",
                  hidden: ({ raffleData }: any) => raffleData?.winnerCnt === 1,
                  items: [
                    {
                      type: "typography",
                      component: "h6",
                      sx: {
                        fontSize: "0.875rem",
                        fontWeight: 700,
                      },
                      label: "RAFFLE.DETAILS.WHITELIST_SPOTS",
                    },
                    {
                      type: "typography",
                      component: "p",
                      label: ({ raffleData }: any) =>
                        `${raffleData?.winnerCnt || 0}`,
                    },
                  ],
                },
              ],
            },
            {
              type: "gridItem",
              xs: 12,
              md: 6,
              items: [
                {
                  type: "empty",
                  hidden: ({ raffleData }: any) => raffleData?.winnerCnt === 1,
                  items: [
                    {
                      type: "typography",
                      component: "h6",
                      sx: {
                        fontSize: "0.875rem",
                        fontWeight: 700,
                      },
                      label: "RAFFLE.DETAILS.RAFFLE_ENDS",
                    },
                    {
                      type: "typography",
                      component: "p",
                      hidden: ({ raffleData }: any) =>
                        new Date() <= new Date(raffleData?.end || 0),
                      label: "RAFFLE.DETAILS.CLOSED",
                    },
                    {
                      type: "countdown",
                      component: "p",
                      sx: { fontSize: "1.5rem" },
                      hidden: ({ raffleData }: any) =>
                        new Date() > new Date(raffleData?.end || 0),
                      update: ({ counterUpdate }: any) => counterUpdate(),
                      endDateTime: ({ raffleData }: any) =>
                        new Date(raffleData?.end || 0),
                    },
                  ],
                },
              ],
            },
            {
              type: "gridItem",
              xs: 12,
              items: [
                {
                  hidden: ({ wallet }: any) => wallet.public !== null,
                  type: "typography",
                  component: "p",
                  sx: {
                    p: 2,
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "#32cbff55",
                    borderRadius: 2,
                    textAlign: "center",
                    background: "#7e7eff40",
                  },
                  label: "WALLET.PLEASE_CONNECT",
                },
                {
                  hidden: ({ wallet }: any) => wallet.public === null,
                  type: "gridItem",
                  xs: 12,
                  md: 6,
                  items: [
                    {
                      type: "typography",
                      component: "h6",
                      label: "RAFFLE.DETAILS.TICKETS_TO_BUY.LABEL",
                    },
                    {
                      type: "number",
                      dataPath: "tickets",
                      min: 1,
                      max: ({ raffleData }: any) =>
                        (raffleData?.maxTickets || 0) -
                        (raffleData?.tickets || 0),
                      onChange: (
                        value: number,
                        { setTickets, raffleData }: any
                      ) => {
                        if (value >= 1 && value <= raffleData?.maxTickets) {
                          setTickets(value);
                        }
                      },
                    },
                    {
                      type: "typography",
                      component: "p",
                      sx: {
                        py: 1,
                      },
                      label: ({ raffleData, t, toFixed, tickets }: any) =>
                        `${t("RAFFLE.DETAILS.YOU_HAVE_TO_PAY")} ${toFixed(
                          (raffleData?.price || 0) * tickets
                        )} ${raffleData?.payType}.`,
                    },
                  ],
                },
                {
                  hidden: ({ wallet }: any) => wallet.public === null,
                  type: "gridItem",
                  items: [
                    {
                      hidden: ({ isAdmin }: any) => !isAdmin,
                      type: "empty",
                      items: [
                        {
                          hidden: ({ raffleData }: any) =>
                            new Date(raffleData?.end || 0) < new Date() &&
                            raffleData?.wl !== 3 &&
                            raffleData?.tickets === 0 &&
                            !raffleData?.isRevealed,
                          type: "button",
                          variant: "contained",
                          sx: { borderRadius: 2, mr: 2 },
                          onClick: (event: any, { handleReClaim }: any) =>
                            handleReClaim(),
                          label: "RAFFLE.DETAILS.ADMIN.RECLAIM",
                        },
                        {
                          hidden: ({ raffleData }: any) =>
                            raffleData?.allClaimed,
                          type: "button",
                          variant: "contained",
                          sx: { borderRadius: 2, mr: 2 },
                          onClick: (event: any, { handleClose }: any) =>
                            handleClose(),
                          label: "RAFFLE.DETAILS.ADMIN.CLOSE",
                        },
                      ],
                    },
                    {
                      hidden: ({ isAdmin }: any) => isAdmin,
                      type: "empty",
                      items: [
                        {
                          hidden: ({ raffleData }: any) =>
                            !(new Date(raffleData?.end || 0) > new Date()),
                          type: "button",
                          variant: "contained",
                          sx: { borderRadius: 2, mr: 2 },
                          onClick: (event: any, { handlePurchase }: any) =>
                            handlePurchase(),
                          label: "RAFFLE.DETAILS.PURCHASE_TICKET",
                        },
                        {
                          hidden: ({ raffleData }: any) =>
                            new Date(raffleData?.end || 0) > new Date(),
                          type: "empty",
                          items: [
                            {
                              hidden: ({ raffleData }: any) =>
                                raffleData?.isRevealed,
                              type: "empty",
                              items: [
                                {
                                  hidden: ({ raffleData }: any) =>
                                    raffleData?.tickets === 0,
                                  type: "typography",
                                  component: "p",
                                  sx: {
                                    p: 2,
                                    mb: 2,
                                    color: "textColor.primary",
                                    borderWidth: 1,
                                    borderStyle: "solid",
                                    borderColor: "#f1d556",
                                    backgroundColor: "#f1d55636",
                                    borderRadius: 2,
                                  },
                                  label: "WARNINGS.CANNOT_SEE_WINNER",
                                },
                                {
                                  hidden: ({ raffleData }: any) =>
                                    raffleData?.tickets === 0,
                                  type: "button",
                                  variant: "contained",
                                  sx: { borderRadius: 2, mr: 2 },
                                  onClick: (
                                    event: any,
                                    { handleRevealWinner }: any
                                  ) => handleRevealWinner(),
                                  label: "RAFFLE.DETAILS.VIEW_WINNERS",
                                },
                              ],
                            },
                            {
                              hidden: ({ raffleData }: any) =>
                                !raffleData?.isRevealed,
                              type: "empty",
                              items: [
                                {
                                  hidden: ({ raffleData }: any) =>
                                    !raffleData?.isClaimed &&
                                    raffleData?.isWinner,
                                  type: "button",
                                  variant: "contained",
                                  sx: { borderRadius: 2 },
                                  onClick: (event: any, { handleClaim }: any) =>
                                    handleClaim(),
                                  label: "RAFFLE.DETAILS.CLAIM",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  hidden: ({ raffleData }: any) =>
                    !(raffleData?.winnerCnt !== 0 && raffleData?.isRevealed),
                  type: "gridItem",
                  xs: 12,
                  items: [
                    {
                      type: "box",
                      sx: {
                        pt: 4,
                      },
                      items: [
                        {
                          type: "box",
                          sx: {
                            display: "flex",
                            flexDirection: "column",
                          },
                          items: [
                            {
                              hidden: ({ raffleData }: any) =>
                                !(raffleData?.wl === 0),
                              type: "typography",
                              component: "p",
                              sx: { fontSize: "1.5rem" },
                              label: "RAFFLE.DETAILS.WINNER_LIST",
                            },
                            {
                              hidden: ({ raffleData }: any) =>
                                !(raffleData?.wl === 1),
                              type: "typography",
                              component: "p",
                              sx: { fontSize: "1.25rem" },
                              label: "RAFFLE.DETAILS.WINNER",
                            },
                            {
                              hidden: ({ raffleData }: any) =>
                                !(
                                  raffleData?.winners &&
                                  raffleData?.winners.length !== 0
                                ),
                              type: "boxList",
                              dataPath: "raffleData.winners",
                              sx: {
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              },
                              items: [
                                {
                                  type: "copyAddress",
                                  address: ({ item }: any) => item.address,
                                },
                                {
                                  type: "typography",
                                  component: "span",
                                  sx: {
                                    width: 70,
                                    ml: 1,
                                    textAlign: "center",
                                  },
                                  label: ({ item }: any) => `# ${item.index}`,
                                },
                                {
                                  type: "typegraphy",
                                  component: "span",
                                  sx: {
                                    width: 70,
                                    ml: 1,
                                    textAlign: "center",
                                  },
                                  label: ({ t, item }: any) => {
                                    item.claimed === 1
                                      ? t("RAFFLE.DETAILS.CLAIMED")
                                      : t("RAFFLE.DETAILS.NOT_YET_CLAIMED");
                                  },
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});
```

### Template Items

To ease the customization of UI, we use `TemplateItem` to render the UI by template, so for different deployment, we can highly customize the layout and features without modifying the code for components or the framework.

The `template` mainly structured as a JS object, here is a sample of template.

```ts
{
  type: "container",
  items: [{
    type: "grid",
    items: [{
      type: 'gridItem',
      items: [{
        type: "typography",
        label: "Hello world"
      }]
    }]
  }]
}
```

This template will render a UI layout same as

```tsx
<Container>
  <Grid container>
    <Grid item>
      <Typography>Hello world</Typography>
    </Grid>
  </Grid>
</Container>
```

To ease the handling of data and functions, we throw all the things to `pipe`, and all components in all levels can use the `pipe` as for customize actions. For example:

```ts
{
  type: 'colorButton',
  colorname:"yellow",
  variant:"contained",
  onClick: (event: any, { handleClaimAll }: any) => handleClaimAll(),
  sx: {
    borderRadius: 5000,
    textTransform: "none",
  },
  label: ({ t, rewardAmount}: any) => `${t("ACTIONS.CLAIM_ALL")} (${rewardAmount.toLocaleString()} ${t("TOKEN.NAME")})`
}
```

This will render a `<ColorButton/>` component. As you can see, in this template item, we have some override on the onClick function and the label.

```ts
onClick: (event: any, { handleClaimAll }: any) => handleClaimAll();
```

```ts
label: ({ t, rewardAmount }: any) =>
  `${t("ACTIONS.CLAIM_ALL")} (${rewardAmount.toLocaleString()} ${t(
    "TOKEN.NAME"
  )})`;
```

For most of the onClick function callback in the `TemplateItem`, we can get the pipe by `(event, pipe) => {}` to handle some extra features that cannot be handled by `TemplateItem` easily.
In this case, we have a `handleClaimAll` function defaultly throw into the pipe by the page, so we can call this function from the pipe in the `onClick` callback.

And for the label, we can define a function instead of a string to resolve some complex text combination. The `pipe` can be used by `(pipe) => {}`. `t` is the translation function to get the defined text in `i18n` json.

Currently the `TemplateItem` support the following components:

Components from MUI v5 (please refer to MUI documentation) as `type`

| `type`         | MUI Component                                                                                                        | Special properties                                                                                                    |
| :------------- | :------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| `container`    | `<Container/>`                                                                                                       | -                                                                                                                     |
| `paper`        | `<Paper/>`                                                                                                           | -                                                                                                                     |
| `collapse`     | `<Collapse><CardContent>{{items}}</CardContent></Collapse>`                                                          | `pipe.expanded`                                                                                                       |
| `card`         | `<Card><CardMedia/><CardContent>{{items}}</CardContent><CardActions>{{buttons}}</CardActions>{{expandItems}}</Card>` | `image, src, imageHeight, alt, title, description, buttons, showLoading, fit = "cover", canExpand, expandItems`       |
| `dialog`       | `<>{{<DialogContent></DialogContent><DialogActions>{{buttons}}</DialogActions>}}</>`                                 | `buttons`                                                                                                             |
| `form`         | `<FormControl>{{items}}</FormControl>`                                                                               | -                                                                                                                     |
| `radioGroup`   | `<RadioGroup>{{options}}</RadioGroup>`                                                                               | `value, onChange, options, radio, dataPath`                                                                           |
| `grid`         | `<Grid container>{{items}}</Grid>`                                                                                   | -                                                                                                                     |
| `gridList`     | `<Grid container>{{<Grid item><Paper><Typography/><Typography/></Paper></Grid>}}{{extraItems}}</Grid>`               | `breakpoints = { xs: 3 }, elevation = 1, sx = { p: 2, display: "flex", justifyContent: "space-between" }, extraItems` |
| `gridItem`     | `<Grid item>{{items}}</Grid>`                                                                                        | -                                                                                                                     |
| `box`          | `<Box>{{items}}</Box>`                                                                                               | -                                                                                                                     |
| `typography`   | `<Typography/>`                                                                                                      | `label`                                                                                                               |
| `chip`         | `<Chip/>`                                                                                                            | `label`                                                                                                               |
| `chipList`     | `<>{{<Chip/>}}</>`                                                                                                   | `data, label`                                                                                                         |
| `button`       | `<Button/>`                                                                                                          | `label, onClick`                                                                                                      |
| `iconButton`   | `<IconButton/>`                                                                                                      | `icon, iconColor, onClick`                                                                                            |
| `link`         | `<Link><Icons></Icons></Link>`                                                                                       | `icon, iconColor, linkLabel`                                                                                          |
| `menu`         | `<Menu>{{items}}</Menu>`                                                                                             | `onClose`, `pipe.anchorElNav`                                                                                         |
| `menuItem`     | `<MenuItem>{{items}}</MenuItem>`                                                                                     | -                                                                                                                     |
| `menuItemList` | `<>{{<MenuItem>{{items by pipe[dataPath]}}</MenuItem>}}</>`                                                          | `dataPath, label`                                                                                                     |
| `image`        | `<Image/>` (mui-image)                                                                                               | `src, image, alt = '', showLoading`                                                                                   |

Custom Component defined beside `TemplateItem` but also can be used.

| `type`              | Custom Component                                                                                    | Properties                                    | Remarks                                       |
| :------------------ | :-------------------------------------------------------------------------------------------------- | :-------------------------------------------- | :-------------------------------------------- |
| `colorButton`       | `<ColorButton/>`                                                                                    | `label, onClick, colorname`                   | Styled Button                                 |
| `toggleColorButton` | `<IconButton/>`                                                                                     | `iconColor`                                   | Icon button for Dark / Light Mode switch      |
| `wallet`            | `<WalletDialogProvider><WalletMultiButton><SolanaIcon/></WalletMultiButton></WalletDialogProvider>` | -                                             | wallet integration                            |
| `empty`             | `<><TemplateItem/></>`                                                                              | -                                             | An Empty fragment containing the templateItem |
| `countdown`         | `<Typography><Coundown/></Typography>`                                                              | `endDateTime`, `update`                       | CountDown component `react-countdown`         |
| `number`            | `<NumberInput/>`                                                                                    | `dataPath, min, max, placeholder`, `onChange` | For number input with step                    |
| `copyAddress`       | `<CopyAddress/>`                                                                                    | `address`                                     | For copy address to clipboard                 |
