import type { Metadata } from "next";
import Link from "next/link";
import ProgressDashboard from "@/components/dashboard/ProgressDashboard";
import { getLabs, getLabNumber } from "@/lib/labs/queries";
import { statusLabels } from "@/lib/labs/types";

export const metadata: Metadata = { title: "ダッシュボード" };

export default function DashboardPage() {
  return (
    <div className="container page-stack">
      <header className="page-heading">
        <p className="eyebrow">ICS LAB</p>
        <h1>ダッシュボード</h1>
        <p>GRID LABのRED / BLUEステージの達成状況を確認できます。</p>
      </header>
      <ProgressDashboard />
      <section className="panel">
        <div className="section-heading"><h2>演習の準備状況</h2></div>
        <ul className="lab-rows">
          {getLabs().map((lab) => (
            <li key={lab.id}>
              <span className="row-number">LAB {getLabNumber(lab.id)}</span>
              <Link href={`/labs/${lab.slug}`}>{lab.title}</Link>
              <span className="status-badge">{statusLabels[lab.status]}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
