"use client";

import LanguageToggle from "@/app/LanguageToggle";
import { Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

const Home = (): React.ReactElement => {
  const t = useTranslations(); // Çevirileri dinamik olarak yöneten hook

  return (
    <Container maxWidth="md" style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom align="center">
        {t("title")}
      </Typography>
      <LanguageToggle /> {/* Dil değiştirme butonunu ekle */}
      <Grid item xs={12} sm={6}>
        <Paper style={{ padding: "20px" }}>
          <Typography variant="h6">{t("meetingRoom.title")}</Typography>
          <Typography variant="body2">{t("meetingRoom.capacity", { count: 10 })}</Typography>
          <Button variant="contained" color="primary" style={{ marginTop: "10px" }}>
            {t("meetingRoom.reserve")}
          </Button>
        </Paper>
      </Grid>
      <Grid container spacing={2} style={{ marginTop: "40px" }}>
        <Grid item xs={12}>
          <Typography variant="h6">{t("scheduler.title")}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label={t("scheduler.startTime")}
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label={t("scheduler.endTime")}
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="secondary" fullWidth style={{ marginTop: "10px" }}>
            {t("scheduler.scheduleTime")}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
