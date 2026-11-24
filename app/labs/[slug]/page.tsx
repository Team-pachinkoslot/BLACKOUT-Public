import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LabIcon } from "@/components/labs/lab-icon";
import { getLabBySlug, getLabNumber, getLabs } from "@/lib/labs/queries";
import { difficultyLabels, statusLabels } from "@/lib/labs/types";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getLabs().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lab = getLabBySlug((await params).slug);
  return { title: lab?.title ?? "演習が見つかりません" };
}

export default async function LabDetailPage({ params }: Props) {
  const lab = getLabBySlug((await params).slug);
  if (!lab) notFound();

  return (
    <div className="container page-stack">
      <nav aria-label="パンくずリスト" className="breadcrumb"><Link href="/labs">演習一覧</Link><span aria-hidden="true">/</span><span>LAB {getLabNumber(lab.id)}</span></nav>
      <header className="detail-heading">
        <div className={`detail-icon lab-art-${lab.difficulty}`}><LabIcon id={lab.id} /></div>
        <div><p className="eyebrow">LAB {getLabNumber(lab.id)}</p><h1>{lab.title}</h1><div className="detail-meta"><span className="status-badge">{statusLabels[lab.status]}</span><span>{difficultyLabels[lab.difficulty]}</span><span>学習時間 {lab.estimatedMinutes}分（仮設定）</span></div></div>
      </header>
      <div className="detail-grid">
        <div className="detail-sections">
          <section className="panel"><h2>シナリオ概要</h2><p>{lab.description}</p></section>
          <section className="panel"><h2>学習目標</h2><ol className="objective-list">{lab.objectives.map((objective, index) => <li key={objective}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{objective}</li>)}</ol></section>
          <section className="panel"><h2>対象設備・情報</h2><p className="muted">このシナリオで扱う設備・情報の例です。</p><ul className="asset-list">{lab.assets.map((asset) => <li key={asset}>{asset}</li>)}</ul></section>
          <section className="panel"><h2>難易度別の演習ステップ</h2>
            <div className="level-list">{lab.levels.map((level, index) => (
              <article key={`${lab.slug}-${level.difficulty}`} className={`level-card level-card-${level.difficulty}`}>
                <div className="level-header"><span className="status-badge">{difficultyLabels[level.difficulty]}</span><span>{level.estimatedMinutes}分</span></div>
                <h3>{String(index + 1).padStart(2, "0")} {level.title}</h3>
                <p>{level.description}</p>
                <ul className="objective-list compact">{level.objectives.map((objective, objectiveIndex) => <li key={objective}><span aria-hidden="true">{String(objectiveIndex + 1).padStart(2, "0")}</span>{objective}</li>)}</ul>
                <ul className="asset-list compact">{level.assets.map((asset) => <li key={asset}>{asset}</li>)}</ul>
              </article>
            ))}</div>
          </section>
        </div>
        <aside className="detail-aside">
          <section className="panel start-panel"><p className="eyebrow">演習環境</p>
            {lab.id === "power-01" ? <><h2>GRID LAB v3</h2><p>模擬変電所を題材に、RED/BLUEチームそれぞれ5ステージのLinux演習を体験できます。</p><Link className="button button-primary" href="/gridlab">演習を開始する →</Link><p className="small-note">Supabaseログインと演習サーバーへの接続が必要です。</p></>
              : lab.id === "water-01" ? <><h2>PROJECT AQUA</h2><p>浄水場を舞台にしたRED/BLUE演習です。模擬ターミナルを使った調査と、安全な復旧判断を学べます。</p><a className="button button-primary" href="https://project-aqua-alpha.vercel.app/labs/water-treatment">演習を開始する →</a><p className="small-note">PROJECT AQUAの外部サイトを開きます。進捗はICS Labとは別に保存されます。</p></> : <><h2>演習は準備中です</h2><p id="runtime-explanation">この設備の実行環境は未実装です。</p><button type="button" disabled aria-describedby="runtime-explanation">演習開始（準備中）</button><p className="small-note">現在はシナリオの内容のみ確認できます。</p></>}
          </section>
          <section className="panel caution-panel"><h2>注意事項</h2><ul><li>演習は隔離された架空の模擬環境で実施します。</li><li>実設備への通信・制御は行いません。</li><li>記載内容と学習時間は開発中の予定です。</li></ul></section>
        </aside>
      </div>
      <Link className="text-link" href="/labs"><span aria-hidden="true">←</span> 演習一覧に戻る</Link>
    </div>
  );
}
