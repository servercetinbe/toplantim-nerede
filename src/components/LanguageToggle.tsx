"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LanguageIcon from "@mui/icons-material/Language";
import { IconButton, Tooltip } from "@mui/material";
import { useLocale } from "next-intl";

const LanguageToggle: React.FC = () => {
  const router = useRouter();
  const currentLocale = useLocale();
  const [locale, setLocale] = useState(currentLocale);

  useEffect(() => {
    const currentLocale = document.cookie
      .split("; ")
      .find(row => row.startsWith("NEXT_LOCALE="))
      ?.split("=")[1];

    if (currentLocale) {
      setLocale(currentLocale);
    }
  }, []);

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "tr" : "en";
    setLocale(newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/`; // Cookie'yi güncelle

    // Sayfayı yeniden yüklemeden router ile değişiklik yap
    router.refresh();
  };

  return (
    <Tooltip title={locale === "en" ? "Switch to Turkish" : "Switch to English"} arrow>
      <IconButton onClick={toggleLocale} color="primary">
        <LanguageIcon />
      </IconButton>
    </Tooltip>
  );
};

export default LanguageToggle;
