import React from "react";

import Home from "./Home";

export const metadata = {
  title: "Max Subarray Sum",
  description: "Calculate the maximum sum of a contiguous subarray from a series of numbers entered by the user.",
  keywords: ["max subarray sum", "numbers", "find max sum"],
  openGraph: {
    title: "Max Subarray Sum",
    description:
      "An algorithm that calculates the maximum sum of a contiguous subarray from the numbers entered by the user.",
    locale: "tr_TR",
    type: "website",
    siteName: "toplantim-nerede",
  },
};
export default function Page(): React.ReactElement {
  return <Home />;
}
