import type {Metadata} from "next";
import {SiteFooter} from "@/components/layout/site-footer";
import {SiteHeader} from "@/components/layout/site-header";
import {RouteTransitionFocus} from "@/components/layout/route-transition-focus";
import {SkipLink} from "@/components/layout/skip-link";
import {getSiteOrigin} from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <SkipLink />
        <SiteHeader />
        <RouteTransitionFocus />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
