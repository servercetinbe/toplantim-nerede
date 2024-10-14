"use client";

import LanguageToggle from "@/app/LanguageToggle";
import { Box, Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

const Home = (): React.ReactElement => {
  const t = useTranslations(); // Çevirileri dinamik olarak yöneten hook

  return (
    <Container maxWidth="md" style={{ padding: "30px", backgroundColor: "#f9f9f9" }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" gutterBottom style={{ fontWeight: 600, color: "#333" }}>
          {t("title")}
        </Typography>
        <LanguageToggle /> {/* Dil değiştirme butonunu ekle */}
      </Box>

      {/* Meeting Room Section */}
      <Paper elevation={3} style={{ padding: "30px", marginBottom: "40px" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h5" style={{ fontWeight: 500 }}>
              {t("meetingRoom.title")}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {t("meetingRoom.capacity", { count: 10 })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button variant="contained" color="primary" size="large" fullWidth style={{ marginTop: "10px" }}>
              {t("meetingRoom.reserve")}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Scheduler Section */}
      <Paper elevation={3} style={{ padding: "30px" }}>
        <Typography variant="h5" style={{ fontWeight: 500, marginBottom: "20px" }}>
          {t("scheduler.title")}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("scheduler.startTime")}
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("scheduler.endTime")}
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
              style={{ marginTop: "20px", padding: "12px" }}
            >
              {t("scheduler.scheduleTime")}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Home;
