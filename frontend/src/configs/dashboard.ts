
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
      mx: 'auto',
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
    maxWidth: 'xl',
    container: {
      spacing: 3,
    }
  }
}