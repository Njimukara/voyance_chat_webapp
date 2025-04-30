import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voyance",
  description:
    "Connectez-vous avec des voyants doués pour des conseils et des aperçus.", // Translated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Ensure no whitespace between <html> and <body> tags
    // Set default theme to dark and language to French
    <html suppressHydrationWarning={true} lang="fr" className="dark">
      <body
        className={cn(
          `${geistSans.variable} ${geistMono.variable} antialiased`,
          "min-h-screen bg-background font-sans"
        )}
      >
        {/* Wrap children with SessionProvider */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
