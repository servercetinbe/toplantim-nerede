import React from "react";

import Home from "./Home";

export const metadata = {
  title: "String Challenge - Convert to Camel Case",
  description:
    // eslint-disable-next-line max-len
    "Convert strings to camel case format where the first letter of each word is capitalized (excluding the first word).",
  keywords: ["string challenge", "camel case", "string conversion", "text formatter"],
  openGraph: {
    title: "String Challenge - Convert to Camel Case",
    description: "An application that converts strings to camel case format.",
    locale: "tr_TR",
    type: "website",
    siteName: "toplantim-nerede",
  },
};

export default function Page(): React.ReactElement {
  return <Home />;
}
