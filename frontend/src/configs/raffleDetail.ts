import { DEFAULT_PAY_TYPE } from "../config";
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
    type: 'gridItem',
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
                  hidden: ({ raffleData }: any) =>
                    raffleData?.winnerCnt === 1,
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
                  hidden: ({ raffleData }: any) =>
                    raffleData?.winnerCnt === 1,
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
                      onChange: (value: number, { setTickets, raffleData }: any) => {
                        if (value >= 1 && value <= raffleData?.maxTickets) {
                          setTickets(value)
                        }
                      }
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
                                  onClick: (
                                    event: any,
                                    { handleClaim }: any
                                  ) => handleClaim(),
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
                    !(
                      raffleData?.winnerCnt !== 0 && raffleData?.isRevealed
                    ),
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
                                  label: ({ item }: any) =>
                                    `# ${item.index}`,
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
