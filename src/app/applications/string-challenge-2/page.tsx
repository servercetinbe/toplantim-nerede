import React from "react";

import Home from "./Home";

export const metadata = {
  title: "String Challenge - HTML Tag Validator",
  description: "Validate nested HTML tags and identify the first mismatched element",
  keywords: ["string challenge", "HTML validation"],
  openGraph: {
    title: "String Challenge - HTML Tag Validator",
    description: "An application that validates nested HTML tags and identifies mismatches.",
    locale: "en_US",
    type: "website",
    siteName: "String Challenge",
  },
};

export default function Page(): React.ReactElement {
  return <Home />;
}