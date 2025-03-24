"use client";

import { EventProvider } from "../context/EventContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return <EventProvider>{children}</EventProvider>;
}
