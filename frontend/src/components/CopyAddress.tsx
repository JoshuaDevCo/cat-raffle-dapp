import { Box, useTheme } from "@mui/material";
import copy from "copy-to-clipboard";
import { useState } from "react";
import { Icons } from "./svgIcons";

export default function CopyAddress(props: { address: string, pipe: any }) {
  const { address, pipe } = props;
  const { t } = pipe;
  const [isCopied, setIsCopied] = useState(false);
  const theme = useTheme();
  const handleCopy = (text: string) => {
    copy(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Box sx={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      margin: '5px 0',
    }} onClick={() => handleCopy(address)}>
      {address.slice(0, 10)}...{address.slice(-10)}
      <span className="copy-icon">
        {!isCopied ? <Icons icon="PastIcon" color={ theme.palette.mode === 'dark' ? "white" : "black" }/> : <span className="copied">{t('ACTIONS.COPIED')}</span>}
      </span>
    </Box>
  );
}
