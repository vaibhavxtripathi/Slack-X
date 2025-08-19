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
              __html: `
                (function() {
                  try {
                    var palette = localStorage.getItem('slack-x-palette') || 'theme-aubergine';
                    var isDark = document.documentElement.classList.contains('dark');
                    var root = document.documentElement;
                    
                    // Remove any existing theme classes
                    ['theme-aubergine', 'theme-ocean', 'theme-graphite', 'theme-sunset', 'theme-midnight'].forEach(function(theme) {
                      root.classList.remove(theme, theme + '-dark');
                    });
                    
                    // Apply saved palette immediately
                    root.classList.add(palette);
                    if (isDark) {
                      root.classList.add(palette + '-dark');
                    }
                  } catch (e) {
                    // Fallback to default theme if there's an error
                  }
                })();
              `,
            }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider>
            <NuqsAdapter>
              <ConvexClientProvider>
                <JotaiProvider>
                  <Modals />
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
