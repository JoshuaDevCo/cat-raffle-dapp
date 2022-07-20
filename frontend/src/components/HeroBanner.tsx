import { Box, Link } from "@mui/material";
import Image from "mui-image";

export default function HeroBanner(props: any) {
    const {
        imageHeight = 240,
        fit = "contain",
        src = "/img/hero-banner.png",
        href = "/"
    } = props;
  return (
    <Box sx={{
        mx: 'auto',
    }}>
      <Link href={href}>
        <Image src={src} alt="" fit={fit} height={imageHeight}></Image>
      </Link>
    </Box>
  );
}
