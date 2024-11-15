import React from "react";
import { GitHub, LinkedIn } from "@mui/icons-material";
import { Box, Container, Divider, IconButton, Stack, Typography } from "@mui/material";

const Footer: React.FC = () => (
  <Box
    component="footer"
    sx={{
      background: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)",
      borderTop: "1px solid rgba(255, 255, 255, 0.3)",
      padding: "16px 0",
      color: "text.secondary",
    }}
  >
    <Container maxWidth="lg">
      <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" justifyContent="space-between" spacing={2}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            fontSize: "1.25rem",
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Rezervasyon Yap !
        </Typography>

        <Stack direction="row" spacing={1}>
          <IconButton color="primary" href="https://github.com/enginmertcan" target="_blank" aria-label="Facebook">
            <GitHub />
          </IconButton>
          <IconButton
            color="primary"
            href="https://www.linkedin.com/in/mertcanenginn54/"
            target="_blank"
            aria-label="LinkedIn"
          >
            <LinkedIn />
          </IconButton>
        </Stack>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Box textAlign="center">
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          © {new Date().getFullYear()} Rezervasyon Yap ! Tüm Hakları Saklıdır.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <a href="/" style={{ color: "inherit", textDecoration: "none", marginRight: 8 }}>
            Gizlilik Politikası
          </a>
          |
          <a href="/" style={{ color: "inherit", textDecoration: "none", marginLeft: 8 }}>
            Kullanım Koşulları
          </a>
        </Typography>
      </Box>
    </Container>
  </Box>
);

export default Footer;
