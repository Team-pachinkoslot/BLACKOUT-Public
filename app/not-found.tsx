import Link from "next/link";

export default function NotFound() {
  return <div className="container not-found"><p className="eyebrow">404 / ページが見つかりません</p><h1>指定されたページはありません。</h1><p>演習一覧から、確認したいシナリオを選んでください。</p><Link className="button button-primary" href="/labs">演習一覧へ戻る <span aria-hidden="true">→</span></Link></div>;
}
