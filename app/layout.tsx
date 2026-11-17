import type { Metadata } from "next";
import "@xterm/xterm/css/xterm.css";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
const appName = "ICS Lab";
export const metadata: Metadata = {
  title: { default: "ICS Lab | 社会インフラ防御シミュレーター", template: "%s | ICS Lab" },
  description: "社会インフラ防御のシナリオを学び、GRID LABの架空の変電所演習でLinux操作を体験する教育用サイト。",
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body><a href="#main-content" className="skip-link">本文へ移動</a><SiteHeader appName={appName}/><main id="main-content" className="site-main" tabIndex={-1}>{children}</main><SiteFooter appName={appName}/></body></html>;
}
