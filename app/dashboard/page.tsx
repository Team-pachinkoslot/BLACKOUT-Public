import type { Metadata } from "next";
import Link from "next/link";
import { getLabs, getLabNumber } from "@/lib/labs/queries";
import { statusLabels } from "@/lib/labs/types";
export const metadata: Metadata = { title: "ダッシュボード" };
export default function DashboardPage() {
  return <div className="container page-stack">
    <header className="page-heading"><p className="eyebrow">ICS LAB</p><h1>ダッシュボード</h1><p>社会インフラ防御演習の開発状況と利用できるシナリオです。</p></header>
    <div className="dashboard-grid">
      <section className="panel history-panel"><h2>GRID LAB v3</h2><p>変電所を題材に、RED/BLUEチーム各5ステージの実習に挑戦できます。クリア進捗は演習画面で確認できます。</p><Link className="button button-primary" href="/gridlab">GRID LABを開く →</Link></section>
      <section className="panel"><p className="eyebrow">現在の構成</p><h2>実装状況</h2><dl className="status-list"><div><dt>演習カタログ</dt><dd>3シナリオ</dd></div><div><dt>変電設備</dt><dd>演習可能</dd></div><div><dt>浄水場・鉄道</dt><dd>準備中</dd></div><div><dt>ログイン・進捗</dt><dd>GRID LABで利用</dd></div></dl></section>
    </div>
    <section className="panel"><div className="section-heading"><h2>演習の準備状況</h2></div><ul className="lab-rows">{getLabs().map(lab => <li key={lab.id}><span className="row-number">LAB {getLabNumber(lab.id)}</span><Link href={`/labs/${lab.slug}`}>{lab.title}</Link><span className="status-badge">{statusLabels[lab.status]}</span></li>)}</ul></section>
  </div>;
}
