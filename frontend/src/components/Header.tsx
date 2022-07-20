import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { adminValidation } from "../contexts/utils";
import { AppBar, Breakpoint, Container, Toolbar } from "@mui/material";
import { TFunction } from "react-i18next";
import { TemplateItem } from "./TemplateItem";

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
      setIsAdmin(admin);
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
    // <header className="header">
    //     <div className="header-content">
    //         <div className="header-left">
    //             <Link href="https://apexpredator.army">
    //                 <a>
    //                     <Image
    //                         src="/img/logo.png"
    //                         width={100}
    //                         height={100}
    //                         alt=""
    //                     />
    //                 </a>
    //             </Link>
    //         </div>
    //         <div className="header-center">
    //             <nav className="header-nav">
    //                 <ul>
    //                     <li>
    //                         <Link href="/">
    //                             <a>Home</a>
    //                         </Link>
    //                     </li>
    //                     {isAdmin &&
    //                         <li>
    //                             <Link href="/create-raffle">
    //                                 <a className={routerName === "create-raffle" ? "active" : ""}>Create</a>
    //                             </Link>
    //                         </li>
    //                     }
    //                     <li>
    //                         <Link href="/raffle">
    //                             <a className={routerName === "raffle" ? "active" : ""}>Raffle house</a>
    //                         </Link>
    //                     </li>
    //                 </ul>
    //             </nav>
    //         </div>
    //         <div className="header-right">
    //             <WalletModalProvider>
    //                 <WalletMultiButton />
    //             </WalletModalProvider>
    //             <div className="mobile-menu">
    //                 <button onClick={() => setOpen(!open)}>
    //                     {open ?
    //                         <CloseIcon color="#fff" />
    //                         :
    //                         <MenuIcon color="#fff" />
    //                     }
    //                 </button>
    //             </div>
    //         </div>
    //     </div>
    //     <div className="header-wallet">
    //     </div>
    //     {open &&
    //         <nav className="mobile-nav" onClick={() => setOpen(false)}>
    //             <ul>
    //                 <li>
    //                     <Link href="/">
    //                         <a>Home</a>
    //                     </Link>
    //                 </li>
    //                 {isAdmin &&
    //                     <li>
    //                         <Link href="/create-raffle">
    //                             <a className={routerName === "create-raffle" ? "active" : ""}>Create</a>
    //                         </Link>
    //                     </li>
    //                 }
    //                 <li>
    //                     <Link href="/raffle">
    //                         <a className={routerName === "raffle" ? "active" : ""}>Raffle house</a>
    //                     </Link>
    //                 </li>
    //             </ul>
    //         </nav>
    //     }
    // </header>
  );
}
