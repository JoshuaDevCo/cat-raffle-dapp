import { Box, Link } from "@mui/material";
import Image from "mui-image";
import { Loading } from "./Loading";

export default function HeroBanner(props: any) {
    const {
      imageHeight = 240,
      fit = "contain",
      src = "/img/hero-banner.png",
      href = "/",
      sx = {
          mx: 'auto',
      },
    } = props;
  return (
    <Box sx={sx}>
      <Link href={href}>
        <Image src={src} alt="" showLoading={<Loading />} fit={fit} height={imageHeight}></Image>
      </Link>
    </Box>
  );
}
