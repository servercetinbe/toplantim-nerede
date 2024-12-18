"use client";

import React from "react";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { CacheProvider } from "@emotion/react";

import createEmotionCache from "../utility/createEmotionCache";

const cache = createEmotionCache();

export const ClientWrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <ClerkProvider>
    <CacheProvider value={cache}>
      <SignedOut />
      <SignedIn></SignedIn>
      {children}
    </CacheProvider>
  </ClerkProvider>
);
