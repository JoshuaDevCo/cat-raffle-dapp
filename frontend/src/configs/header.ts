const handleOpenNavMenu = (
  event: React.MouseEvent<HTMLElement>,
  { setAnchorElNav }: any
) => {
  setAnchorElNav(event.currentTarget);
};
const handleCloseNavMenu = (
  event: React.MouseEvent<HTMLElement>,
  { setAnchorElNav }: any
) => {
  setAnchorElNav(null);
};

const handleTwitterClick = (
  event: React.MouseEvent<HTMLElement>,
  { config }: any
) => {
  if (config && config.twitter) {
    window.open(config.twitter, "_blank");
  }
};
const handleDiscordClick = (
  event: React.MouseEvent<HTMLElement>,
  { config }: any
) => {
  if (config && config.discord) {
    window.open(config.discord, "_blank");
  }
};
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
          items: [{
            type: 'menuItem',
            items: [{
              type: "typography",
              label: "MENU.HOME",
              textAlign: "center",
              noWrap: true,
              component: "a",
              sx: {
                px: 2,
                textDecoration: 'none',
                color: 'text.primary'
              },
              href: "/",
            }]
          }, {
            type: 'menuItem',
            hidden: ({ isAdmin }: any) => !isAdmin,
            items: [{
              type: "typography",
              label: "MENU.CREATE",
              textAlign: "center",
              noWrap: true,
              component: "a",
              sx: {
                px: 2,
                textDecoration: 'none',
                color: 'text.primary'
              },
              className: ({ routerName, theme }: any) =>
                routerName === "create-raffle" ? `active ${theme.palette.mode}` : `${theme.palette.mode}`,
              href: "/create-raffle",
            }]
          }, {
            type: 'menuItem',
            items: [{
              type: "typography",
              label: "MENU.RAFFLE_HOUSE",
              textAlign: "center",
              noWrap: true,
              component: "a",
              sx: {
                px: 2,
                textDecoration: 'none',
                color: 'text.primary'
              },
              className: ({ routerName, theme }: any) =>
                routerName === "raffle" ? `active ${theme.palette.mode}` : `${theme.palette.mode}`,
              href: "/",
            }],
          }]
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
                routerName === "create-raffle" ? `active ${theme.palette.mode}` : "",
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
