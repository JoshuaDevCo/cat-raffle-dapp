import { TOKEN_BUYING_HREF } from "../config";

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
