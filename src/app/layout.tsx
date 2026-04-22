import type { Metadata } from "next";
import "./globals.css";
import TopBar from "@/components/layout/TopBar";
import TickerTape from "@/components/ui/TickerTape";
import StatusBar from "@/components/layout/StatusBar";

export const metadata: Metadata = {
  title: "RUMPUT ID - Terminal Hedge Fund. Isi Laporan Warung.",
  description: "Crowdsourced investment screener for the Indonesian stock market.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="scanlines">
        <TickerTape />
        <TopBar />
        <main>
          {children}
        </main>
        <StatusBar />
      </body>
    </html>
  );
}
