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
    imageHeight: number,
    fit: "contain" | "cover",
    src: "string",
    href: "string"
  };
  items: Array<any>;
}) => {
  const {
    maxWidth,
    className,
    sx,
    items,
    banner = {},
    ...otherProps
  } = props;
  return (
    <Box className={className} sx={sx}>
      <Container maxWidth={maxWidth}>
        <HeroBanner {...banner} {...otherProps} />
        <RaffleList items={items} {...otherProps} />
      </Container>
    </Box>
  );
};

export default RafflePage;
