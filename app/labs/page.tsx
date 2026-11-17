import type { Metadata } from "next";
import { LabCard } from "@/components/labs/lab-card";
import { RuntimeNotice } from "@/components/runtime-notice";
import { getLabs } from "@/lib/labs/queries";

export const metadata: Metadata = { title: "演習一覧" };

export default function LabsPage() {
  const labs = getLabs();

  return (
    <div className="container page-stack">
      <header className="page-heading"><p className="eyebrow">演習カタログ</p><h1>演習一覧</h1><p>初級 → 中級 → 上級で進む、身近なインフラを題材にした調査・防御・復旧の学習です。</p></header>
      <RuntimeNotice />
      <section aria-labelledby="catalog-title">
        <div className="section-heading"><h2 id="catalog-title">シナリオを選ぶ</h2><span className="muted">全{labs.length}件 · 初級 / 中級 / 上級の進行</span></div>
        <div className="lab-grid">{labs.map((lab) => <LabCard key={lab.id} lab={lab} />)}</div>
      </section>
      <p className="page-footnote">記載の学習時間は仮設定です。実際の演習内容・所要時間は今後の開発で確定します。</p>
    </div>
  );
}
