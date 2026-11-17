import HomeAuth from "@/components/HomeAuth";
import Link from "next/link";
import { LabCard } from "@/components/labs/lab-card";
import { RuntimeNotice } from "@/components/runtime-notice";
import { getLabs } from "@/lib/labs/queries";

export default function Home() {
  const labs = getLabs();

  return (
    <div className="container page-stack">
      <section className="hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow light">ICS LAB / SECURITY TRAINING</p>
          <h1 id="home-title">社会インフラを守る。<br />その判断を、ここで学ぶ。</h1>
          <p className="hero-description">浄水場、変電設備、鉄道運行管理。<br className="desktop-break" />初級 → 中級 → 上級で進む、<br className="desktop-break" />異常の調査から防御・復旧までを学ぶ教育用シミュレーターです。</p>
          <Link className="button button-white" href="/labs">演習一覧を見る <span aria-hidden="true">→</span></Link>
        </div>
        <div className="hero-outline">
          <span className="outline-tag">学習のアプローチ</span>
          <ol className="learning-flow">
            <li><span>01</span><div><strong>調査する</strong><p>異常を捉え、原因を見極める</p></div></li>
            <li><span>02</span><div><strong>防御する</strong><p>影響を抑え、安全な状態へ導く</p></div></li>
            <li><span>03</span><div><strong>復旧する</strong><p>安全を確認し、運用を取り戻す</p></div></li>
          </ol>
          <p className="outline-footnote">実行可能な演習は架空の模擬変電所のみ</p>
        </div>
      </section>

      <HomeAuth />

      <RuntimeNotice />

      <section aria-labelledby="scenarios-title">
        <div className="section-heading">
          <div><p className="eyebrow">演習カタログ</p><h2 id="scenarios-title">3つのインフラ、3つの学び。</h2></div>
          <Link className="text-link" href="/labs">すべての演習を見る <span aria-hidden="true">→</span></Link>
        </div>
        <div className="lab-grid">{labs.map((lab) => <LabCard key={lab.id} lab={lab} />)}</div>
      </section>

      <section className="scope-panel" aria-labelledby="scope-title">
        <div><p className="eyebrow">開発状況</p><h2 id="scope-title">演習を選んで、実際に操作する。</h2><p>変電設備はGRID LABで操作可能です。浄水場と鉄道は開発中です。</p></div>
        <Link className="button button-outline" href="/dashboard">ダッシュボードを見る <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  );
}
