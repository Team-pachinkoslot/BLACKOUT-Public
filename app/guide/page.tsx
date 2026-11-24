import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "演習ガイド" };

const commands = [
  ["pwd", "現在のディレクトリを確認"],
  ["ls -la", "隠しファイルを含む一覧表示"],
  ["cd /path", "ディレクトリ移動"],
  ["cat file.txt", "ファイル内容を表示"],
  ["find . -type f", "ファイルを検索"],
  ["grep -n 'word' file.txt", "文字列を検索"],
  ["head -n 20 file.txt", "先頭20行を表示"],
  ["tail -n 20 file.txt", "末尾20行を表示"],
  ["id", "ユーザーとグループを確認"],
  ["ps aux", "プロセスを確認"],
];
const teams = [
  { title: "RED TEAM", description: "攻撃者視点で模擬Linux環境を調査する", stages: ["初期偵察", "サービス調査", "設定ファイル解析", "ログの相関分析", "最終監査報告"] },
  { title: "BLUE TEAM", description: "防御者視点で監視・調査・報告を学ぶ", stages: ["ベースライン確認", "ログ調査", "権限の確認", "異常検知", "監査報告"] },
];
export default function GuidePage() {
  return <div className="container page-stack">
    <header className="page-heading"><p className="eyebrow">ICS LAB / GUIDE</p><h1>演習ガイド</h1><p>GRID LAB v3の進め方とLinuxの基本操作を確認できます。</p></header>
    <section className="panel"><h2>演習の始め方</h2><ol className="objective-list">
      {["ICS Labにログインする", "演習一覧から変電設備を選ぶ", "RED / BLUE TEAMとステージを選択", "サーバー稼働中に接続ボタンを押す", "指示文とログを読みながら調査する"].map((s,i)=><li key={s}><span>{String(i+1).padStart(2,"0")}</span>{s}</li>)}
    </ol><p className="small-note" style={{marginTop:16}}>Raspberry Piが停止中でも、このガイドは閲覧できます。正解のFLAGは掲載しません。</p></section>
    <div className="dashboard-grid">{teams.map(t=><section className="panel" key={t.title}><h2>{t.title}</h2><p>{t.description}</p><ol className="objective-list" style={{marginTop:16}}>{t.stages.map((s,i)=><li key={s}><span>{String(i+1).padStart(2,"0")}</span>{s}</li>)}</ol></section>)}</div>
    <section className="panel"><h2>Linux基本コマンド</h2><p className="muted">実際に使えるコマンドは演習環境によって異なります。</p>
      <div style={{overflowX:"auto",marginTop:16}}><table style={{width:"100%",borderCollapse:"collapse",textAlign:"left"}}><thead><tr><th style={{padding:12,borderBottom:"1px solid #dce3e9"}}>コマンド例</th><th style={{padding:12,borderBottom:"1px solid #dce3e9"}}>用途</th></tr></thead><tbody>{commands.map(([cmd,desc])=><tr key={cmd}><td style={{padding:12,borderBottom:"1px solid #e8ecf0",whiteSpace:"nowrap"}}><code>{cmd}</code></td><td style={{padding:12,borderBottom:"1px solid #e8ecf0"}}>{desc}</td></tr>)}</tbody></table></div>
    </section>
    <section className="panel"><h2>安全上の注意</h2><p>本演習は架空の隔離環境向けです。実際の変電設備や第三者のシステムには実行しないでください。</p><div style={{marginTop:20,display:"flex",gap:12,flexWrap:"wrap"}}><Link className="button button-primary" href="/labs/power-substation">変電設備の演習へ</Link><Link className="button button-outline" href="/gridlab">GRID LABを開く</Link></div></section>
  </div>;
}