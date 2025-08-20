import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import "./globals.css";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Modals } from "@/features/workspaces/components/Modals";
import { Toaster } from "@/components/ui/sonner";
import { JotaiProvider } from "@/components/jotaiProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SearchModalWrapper } from "@/components/SearchModalWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Slack X",
  description: "Slack X",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html:
                "(function(){try{var STORAGE_KEY='slack-x-palette';var palette=localStorage.getItem(STORAGE_KEY)||'theme-aubergine';var isDark=(function(){try{return localStorage.getItem('theme')==='dark';}catch(e){return false;}})();var root=document.documentElement;var KEYS=['theme-aubergine','theme-uru','theme-ocean','theme-sunset','theme-midnight'];for(var i=0;i<KEYS.length;i++){root.classList.remove(KEYS[i],KEYS[i]+'-dark');}root.classList.add(palette);if(isDark){root.classList.add(palette+'-dark');}}catch(e){}})();",
            }}
          />
          <title>Slack X</title>
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider>
            <NuqsAdapter>
              <ConvexClientProvider>
                <JotaiProvider>
                  <Modals />
                  <SearchModalWrapper />
                  <Toaster />
                  {children}
                </JotaiProvider>
              </ConvexClientProvider>
            </NuqsAdapter>
          </ThemeProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
