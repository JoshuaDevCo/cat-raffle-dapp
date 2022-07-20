import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import {
  WalletDialogProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-material-ui";
import { get, map, isFunction, trim } from "lodash";
import { ExpandMoreIcon, Icons, SolanaIcon } from "./svgIcons";
import { Image } from "mui-image";
import { ColorButton } from "./ColorButton";
import { ExpandMore } from "./ExpandMore";
import { HashLoader } from "react-spinners";

const getKey = (item: any, index: number) => `${get(item, "type")}#${Math.floor(Math.random()*100)}#${index}`;
const renderComponent = ({ items, pipe }: any, { item, index }: any) => {
  const { t, theme, colorMode, dataModel, expanded, handleExpandClick, opened } = pipe;
  const isDarkMode = theme?.palette?.mode === "dark";
  const { type, items: subItems, hidden = false, ...otherProps } = item;
  const key = getKey(item, index);
  if (isFunction(hidden) ? !!hidden(pipe) : !!hidden) {
    return <></>
  }
  const processFunc = (value: Function | string | number, params = pipe) => isFunction(value) ? value(params) : value;
  const components: any = {
    container: () => (
      <Container key={key} {...otherProps}>
        <TemplateItem key={`${key}#item`} items={subItems} pipe={pipe}></TemplateItem>
      </Container>
    ),
    paper: () => (
      <Paper key={key} {...otherProps}>
        <TemplateItem key={`${key}#item`} items={subItems} pipe={pipe}></TemplateItem>
      </Paper>
    ),
    collapse: () => {
      const { ...collapseProps } = otherProps;
      return <Collapse key={key} in={expanded} {...collapseProps}>
        <CardContent>
          <TemplateItem key={`${key}#item`} items={subItems} pipe={pipe}></TemplateItem>
        </CardContent>
      </Collapse>
    },
    card: () => {
      const {
        image,
        src,
        imageHeight,
        alt,
        title,
        description,
        buttons,
        showLoading,
        fit = "cover",
        canExpand,
        expandItems,
        ...cardProps
      } = otherProps;
      return (
        <Card key={key} {...cardProps}>
          {src && (
            <CardMedia>
              <Image
                height={imageHeight}
                src={src || image}
                alt={alt}
                showLoading={showLoading && <HashLoader size={32} color="#c300ff" />} 
                fit={fit}
              ></Image>
            </CardMedia>
          )}
          <CardContent>
            {title && (
              <TemplateItem
                key={`${key}#item`}
                items={[
                  {
                    type: "typography",
                    label: processFunc(title),
                    variant: "h6",
                  },
                ]}
                pipe={pipe}
              ></TemplateItem>
            )}
            {description && (
              <TemplateItem key={`${key}#desc#item`} items={description} pipe={pipe}></TemplateItem>
            )}
          </CardContent>
          <CardActions>
            <TemplateItem key={`${key}#action#item`} items={buttons} pipe={pipe}></TemplateItem>
            { canExpand && <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}>
                <ExpandMoreIcon />
              </ExpandMore>
            }
          </CardActions>
          { canExpand && <TemplateItem key={`${key}#expand#item`} items={expandItems} pipe={pipe}></TemplateItem>}
        </Card>
      );
    },
    dialog: () => {
      const { buttons } = otherProps;
      return <>
        {
          map(subItems, ({ items: contentItems, ...contentProps }, idx) => 
          <DialogContent key={`${key}#content#${idx}`} {...contentProps}>
            <TemplateItem key={`${key}#content#item`} items={contentItems} pipe={pipe}></TemplateItem>
          </DialogContent>
        )}
        { buttons && <DialogActions>
          <TemplateItem key={`${key}#action#item`} items={buttons} pipe={pipe}></TemplateItem>
        </DialogActions>}
      </>
    },
    form: () => {
      const { ...formProps } = otherProps;
      return <FormControl key={key} {...formProps}>
        <TemplateItem key={`${key}#item`} items={subItems} pipe={pipe}></TemplateItem>
      </FormControl>
    },
    radioGroup: () => {
      const { value, onChange, options, radio, dataPath, ...radioGrpProps } = otherProps;
      return <RadioGroup key={key} value={pipe[dataPath]} onChange={(event: any) => onChange && onChange(event, pipe)} {...radioGrpProps}>
        {
          map(options, ({ value, label, description }, idx) => <>
            <FormControlLabel key={`${key}#radio#${idx}`} value={value} control={<Radio {...radio}/>} label={t(processFunc(label))} />
            { description && <Typography key={`${key}#p#${idx}`} component='p' sx={{ marginLeft: 4 }}> {t(processFunc(description))} </Typography> }
            </>)
        }
      </RadioGroup>
    },
    grid: () => {
      const { spacing } = otherProps;
      return (
        <Grid key={key} container spacing={spacing} {...otherProps}>
          <TemplateItem key={`${key}#grid#item`} items={subItems} pipe={pipe}></TemplateItem>
        </Grid>
      );
    },
    gridList: () => {
      const {
        spacing: gridListSpacing,
        breakpoints = { xs: 3 },
        elevation = 1,
        sx = {
          p: 2,
          display: "flex",
          justifyContent: "space-between",
        },
        extraItems,
        ...gridListProps
      } = otherProps;
      return (
        <Grid key={key} container spacing={gridListSpacing} {...gridListProps}>
          {subItems &&
            map(subItems, ({ label, key }) => (
              <Grid key={`grid#${key}`} item {...breakpoints}>
                <Paper key={`paper#${key}`} elevation={elevation} sx={sx}>
                  <Typography component="h6">{t(processFunc(label))}</Typography>
                  <Typography component="p">
                    {get(dataModel, key, 0)}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          <TemplateItem key={`${key}#item`} items={extraItems} pipe={pipe}></TemplateItem>
        </Grid>
      );
    },
    gridItem: () => {
      const { ...gridItemProps } = otherProps;
      return (
        <Grid key={key} item {...gridItemProps}>
          <TemplateItem key={`${key}#item`} items={subItems} pipe={pipe}></TemplateItem>
        </Grid>
      );
    },
    box: () => {
      const { ...boxProps } = otherProps;
      return (
        <Box key={key} {...boxProps}>
          <TemplateItem key={`${key}#item`} items={subItems} pipe={pipe}></TemplateItem>
        </Box>
      );
    },
    typography: () => {
      const { label, className, ...typoProps } = otherProps;
      return (
        <Typography key={key} className={processFunc(className)}  {...typoProps}>
          {t(processFunc(label))}
        </Typography>
      );
    },
    chip: () => {
      const { label: chipLabel, ...chipProps } = otherProps;
      return (
        <Chip
          key={key}
          label={t(processFunc(chipLabel))}
          {...chipProps}
        ></Chip>
      );
    },
    chipList: () => {
      const { label: chipListLabel, data, ...chipListProps } = otherProps;
      return (
        <>{
          map(data, (dataItem: any, idx: number) => <Chip
            key={`${key}#${idx}`}
            label={t(processFunc(chipListLabel, { ...pipe, data: dataItem }))}
            {...chipListProps}
          ></Chip>)
        }</>
      );
    },
    button: () => {
      const {
        label: buttonLabel,
        onClick: onButtonClick,
        ...buttonProps
      } = otherProps;
      return (
        <Button
          key={key}
          onClick={(event) => onButtonClick && onButtonClick(event, pipe)}
          {...buttonProps}
        >
          {t(processFunc(buttonLabel))}
        </Button>
      );
    },
    colorButton: () => {
      const {
        label: colorBtnLabel,
        onClick: onColorBtnClick,
        ...colorBtnProps
      } = otherProps;
      return (
        <ColorButton
          key={key}
          onClick={(event: any) => onColorBtnClick && onColorBtnClick(event, pipe)}
          {...colorBtnProps}
        >
          {t(processFunc(colorBtnLabel))}
        </ColorButton>
      );
    },
    iconButton: () => {
      const {
        icon,
        iconColor,
        onClick: onIconButtonClick,
        ...iconBtnProps
      } = otherProps;
      const finalIconColor = isDarkMode
        ? theme.palette.getContrastText(iconColor)
        : iconColor;
      return (
        <IconButton
          key={key}
          onClick={(event) => onIconButtonClick && onIconButtonClick(event, pipe)}
          {...iconBtnProps}
        >
          <Icons icon={icon} color={finalIconColor}></Icons>
        </IconButton>
      );
    },
    toggleColorButton: () => {
      const { iconColor: toggleIconColor, ...toggleIconProps } = otherProps;
      const finalColor = isDarkMode
        ? theme.palette.getContrastText(toggleIconColor)
        : toggleIconColor;
      return (
        <IconButton
          key={key}
          onClick={colorMode.toggleColorMode}
          color="inherit"
          {...toggleIconProps}
        >
          {isDarkMode ? (
            <Icons icon="Brightness7Icon" color={finalColor} />
          ) : (
            <Icons icon="Brightness4Icon" color={finalColor} />
          )}
        </IconButton>
      );
    },
    link: () => {
      const {
        icon: linkIcon,
        iconColor: linkIconColor,
        linkLabel = "",
        className,
        ...linkProps
      } = otherProps;
      return (
        <Link key={key} className={processFunc(className)} {...linkProps}>
          {linkIcon && <Icons icon={linkIcon} color={linkIconColor}></Icons>} {processFunc(linkLabel)}
        </Link>
      );
    },
    menu: () => {
      const { onClose, ...menuProps } = otherProps;
      return (
        <Menu
          key={key}
          anchorEl={get(pipe, "anchorElNav")}
          open={Boolean(get(pipe, "anchorElNav"))}
          onClose={(event) => onClose && onClose(event, pipe)}
          {...menuProps}
        >
          <TemplateItem key={`${key}#item`} items={subItems} pipe={pipe}></TemplateItem>
        </Menu>
      );
    },
    menuItem: () => {
      const { ...menuItemProps } = otherProps;
      return (
        <MenuItem key={key} {...menuItemProps}>
          <TemplateItem key={`${key}#item`} items={subItems} pipe={pipe}></TemplateItem>
        </MenuItem>
      );
    },
    image: () => {
      const { src, image, alt = '', showLoading, ...imageProps } = otherProps;
      return <Image key={key} src={src || (isFunction(image) ? image(pipe) : image)} alt={alt} showLoading={showLoading && <HashLoader size={32} color="#c300ff" />} {...imageProps} />
    },
    wallet: () => (
      <WalletDialogProvider key={key}>
        <WalletMultiButton {...otherProps}>
          <SolanaIcon></SolanaIcon>
        </WalletMultiButton>
      </WalletDialogProvider>
    ),
  };
  const trimmedType = trim(item?.type);
  return isFunction(components[trimmedType]) ? components[trimmedType]() : <></>;
};
export function TemplateItem(props: any) {
  const { items, pipe } = props;
  if (!items) {
    return <></>;
  }
  return (
    <>
      {map(items, (item: any, index: number) =>
        renderComponent({ items, pipe }, { item, index })
      )}
    </>
  );
}
