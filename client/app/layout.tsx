import { getMe } from "@/lib/authServer";
import type { Metadata } from "next";
import { Alegreya_Sans, Alegreya_Sans_SC } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const alegreyaSans = Alegreya_Sans({
  variable: "--font-alegreya-sans",
  weight: ["400", "500", "700", "800"],
  subsets: ["latin", "latin-ext", "cyrillic"],
});

const alegreyaSansSC = Alegreya_Sans_SC({
  variable: "--font-alegreya-sans-sc",
  weight: ["400", "500", "700", "800"],
  subsets: ["latin", "latin-ext", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Events Tracker",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let userReqResult = await getMe();

  return (
    <html>
      <body
        className={`flex justify-center min-w-screen min-h-screen ${alegreyaSans.variable} ${alegreyaSansSC.variable} bg-mblue-900 antialiased h-screen p-4`}
      >
        <Providers user={userReqResult}>{children}</Providers>
      </body>
    </html>
  );
}
