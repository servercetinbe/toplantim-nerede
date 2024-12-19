import React from "react";
import { GitHub, LinkedIn } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

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
          <Tooltip title="GitHub profilini ziyaret et">
            <IconButton
              color="primary"
              href="https://github.com/enginmertcan"
              target="_blank"
              aria-label="Visit GitHub profile of Mertcan Engin"
              rel="noopener noreferrer"
            >
              <GitHub />
            </IconButton>
          </Tooltip>

          <Tooltip title="LinkedIn profilini ziyaret et">
            <IconButton
              color="primary"
              href="https://www.linkedin.com/in/mertcanenginn54/"
              target="_blank"
              aria-label="Visit LinkedIn profile of Mertcan Engin"
              rel="noopener noreferrer"
            >
              <LinkedIn />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Box textAlign="center">
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          © {new Date().getFullYear()} Rezervasyon Yap! Tüm Hakları Saklıdır. |
          <a href="/" style={{ color: "inherit", textDecoration: "none", margin: "0 8px" }}>
            Gizlilik Politikası
          </a>
          |
          <a href="/" style={{ color: "inherit", textDecoration: "none", margin: "0 8px" }}>
            Kullanım Koşulları
          </a>
        </Typography>
      </Box>
    </Container>
  </Box>
);

export default Footer;
