import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import * as colors from "@mui/material/colors";
import { get } from "lodash";

export const ColorButton = styled(Button)<any>(
  ({ theme, colorname = "white" }) => {
    const color = get(colors, colorname);
    return {
      color: theme.palette.getContrastText(color[500]),
      backgroundColor: color[500],
      "&:hover": {
        backgroundColor: color[700],
      },
    };
  }
);
