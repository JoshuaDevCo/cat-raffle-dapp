import { useEffect } from "react";
import { useRouter } from "next/router";
import Image from "mui-image";
import { Loading } from "./Loading";
import { Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material";

export default function ReadyCard(props: { pipe: any, image: string, name: string, mint: string }) {
  const router = useRouter();
  const { pipe, image, name, mint } = props;
  const { t } = pipe;

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card>
        <CardMedia>
          <Image src={image} alt="" showLoading={<Loading/>}></Image>
        </CardMedia>
        <CardContent>
          <Typography component="p">{name}</Typography>
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" 
            onClick={() => router.push(`/raffle/new/${mint}`)}>
            {t('RAFFLE.ADMIN.CREATE')}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
