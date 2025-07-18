
import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { Toaster } from "~/components/ui/toaster";
import SessionProviderWrapper from "~/components/providers/SessionProviderWrapper";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  metadataBase: new URL("https://vidiwise.com"),
  title: "Vidiwise - Turn Videos into Smart Knowledge",
  description:
    "Transform any YouTube video into smart knowledge with AI-powered summaries, interactive transcripts, and intelligent chat. Free to use, no payment required.",
  icons: [{ rel: "icon", url: "/logo.svg" }],
  twitter: {
    card: "summary_large_image",
    title: "Vidiwise - Turn Videos into Smart Knowledge",
    description: "Transform any YouTube video into smart knowledge with AI-powered summaries, interactive transcripts, and intelligent chat. Free to use, no payment required.",
  },
  openGraph: {
    title: "Vidiwise - Turn Videos into Smart Knowledge",
    description: "Transform any YouTube video into smart knowledge with AI-powered summaries, interactive transcripts, and intelligent chat. Free to use, no payment required.",
    type: "website",
    url: "https://vidiwise.com",
  },
  keywords: ["video transcription", "AI video summary", "YouTube transcripts", "video chat", "knowledge extraction", "free video tools"],
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} h-full w-full`}>
        <SessionProviderWrapper>
          {children}
          <Toaster />
        </SessionProviderWrapper>
      </body>
      <GoogleAnalytics gaId="G-E6J1E0YXT3" />
    </html>
  );
}
