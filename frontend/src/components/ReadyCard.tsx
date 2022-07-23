import { useRouter } from "next/router";
import Image from "mui-image";
import { Loading } from "./Loading";
import { Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material";

export default function ReadyCard(props: { pipe: any, image: string, name: string, mint: string, key: string | number }) {
  const router = useRouter();
  const { pipe, image, name, mint } = props;
  const { t } = pipe;

  return (
    <Grid item xs={6} md={4} lg={3} xl={2}>
      <Card sx={{height: '100%'}}>
        <CardMedia sx={{minHeight: 'calc(100% - 108.5px)', alignItems: 'center', display: 'flex'}}>
          <Image src={image} alt="" showLoading={<Loading/>} ></Image>
        </CardMedia>
        <CardContent>
          <Typography noWrap component="p">{name}</Typography>
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" sx={{ width: '100%'}}
            onClick={() => router.push(`/raffle/new/${mint}`)}>
            {t('RAFFLE.ADMIN.CREATE')}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
