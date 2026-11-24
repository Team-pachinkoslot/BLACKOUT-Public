"use client";

import Link from "next/link";
import HeaderAccount from "./HeaderAccount";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "ホーム" },
  { href: "/labs", label: "演習一覧" },
  { href: "/dashboard", label: "ダッシュボード" },
  { href: "/guide", label: "演習ガイド" },
];

export function SiteHeader({ appName }: { appName: string }) {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label={`${appName} ホーム`}>
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Z" /><path d="m8 12 3 3 5-6" /></svg>
          </span>
          <span>{appName}<small>社会インフラ防御シミュレーター</small></span>
        </Link>
        <nav aria-label="メインナビゲーション">
          {links.map(({ href, label }) => {
            const current = href === "/" ? pathname === href : pathname.startsWith(href);
            return <Link key={href} href={href} aria-current={current ? "page" : undefined}>{label}</Link>;
          })}
        </nav>
        <HeaderAccount />
        <span className="local-badge"><span aria-hidden="true" />学習プレビュー</span>
      </div>
    </header>
  );
}
