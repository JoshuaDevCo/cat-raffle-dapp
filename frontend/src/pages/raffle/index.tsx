import RaffleList from "../../components/RaffleList";
import HeroBanner from "../../components/HeroBanner";
import { Box, Breakpoint, Container } from "@mui/material";
import { TFunction } from "react-i18next";
const RafflePage = (props: {
  startLoading: Function;
  closeLoading: Function;
  t: TFunction;
  theme: any;
  maxWidth: Breakpoint;
  className: string;
  sx: any;
  banner: {
    hidden?: boolean;
    imageHeight?: number;
    fit: "contain" | "cover";
    src: "string";
    href: "string";
    sx: any;
  };
  items: Array<any>;
}) => {
  const {
    maxWidth,
    className,
    sx,
    items,
    banner = {
      hidden: false,
    },
    ...otherProps
  } = props;
  return (
    <Box className={className} sx={sx}>
      <Container maxWidth={maxWidth}>
        {banner && !banner.hidden && <HeroBanner {...banner} />}
        <RaffleList items={items} {...otherProps} />
      </Container>
    </Box>
  );
};

export default RafflePage;
