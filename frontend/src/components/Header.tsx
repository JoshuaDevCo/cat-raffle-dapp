import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { adminValidation } from "../contexts/utils";
import { AppBar, Breakpoint, Container, Toolbar } from "@mui/material";
import { TFunction } from "react-i18next";
import { TemplateItem } from "./TemplateItem";
import { DEBUG } from "../config";

export default function Header(props: {
  position?: "fixed" | "absolute" | "sticky" | "static" | "relative";
  color?: "inherit" | "primary" | "secondary" | "default" | "transparent";
  maxWidth?: Breakpoint;
  disableGutters?: boolean;
  items: any;
  t: TFunction;
  theme: any;
  colorMode: any;
  config: any;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const wallet = useWallet();
  const router = useRouter();
  const [routerName, setRouterName] = useState("");
  const {
    position,
    color,
    maxWidth,
    disableGutters,
    items,
    t,
    theme,
    colorMode,
    config,
  } = props;
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (wallet.publicKey !== null) {
      const admin = adminValidation(wallet);
      setIsAdmin(DEBUG ? true : admin);
      setRouterName(router.pathname.split("/")[1]);
    } else {
      setIsAdmin(false);
    }
    // eslint-disable-next-line
  }, [wallet.connected, isAdmin, router]);
  return (
    <AppBar
      position={position}
      color={color}
      sx={{
        backgroundColor: "background.default",
        color: "text.primary",
      }}
    >
      <Container maxWidth={maxWidth}>
        <Toolbar disableGutters={disableGutters}>
          <TemplateItem
            items={items}
            pipe={{ anchorElNav, setAnchorElNav, t, theme, colorMode, config, routerName, setRouterName, isAdmin }}
          ></TemplateItem>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
