"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const AQUA_ORIGIN = "https://project-aqua-alpha.vercel.app";
const STORAGE_KEY = "ics-lab-aqua-progress-v1";

type AquaSummary = {
  version: 1;
  labId: "water-01";
  redCompleted: number;
  blueCompleted: number;
  score: number;
  complete: boolean;
  sharedAt: string;
};

function isSummary(input: unknown): input is AquaSummary {
  if (!input || typeof input !== "object") return false;
  const v = input as Record<string, unknown>;
  return v.version === 1 && v.labId === "water-01" &&
    Number.isInteger(v.redCompleted) && Number(v.redCompleted) >= 0 && Number(v.redCompleted) <= 5 &&
    Number.isInteger(v.blueCompleted) && Number(v.blueCompleted) >= 0 && Number(v.blueCompleted) <= 5 &&
    Number.isInteger(v.score) && Number(v.score) >= 0 && Number(v.score) <= 100 &&
    typeof v.complete === "boolean" && typeof v.sharedAt === "string" &&
    Number.isFinite(Date.parse(v.sharedAt));
}

export default function AquaProgress() {
  const [progress, setProgress] = useState<AquaSummary | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data: unknown = JSON.parse(raw);
        if (isSummary(data)) setProgress(data);
      }
    } catch { setMessage("このブラウザの進捗保存が利用できません。"); }

    function receive(event: MessageEvent) {
      if (event.origin !== AQUA_ORIGIN || event.source !== window.opener) return;
      const payload = event.data as { type?: string; summary?: unknown } | null;
      if (payload?.type !== "ICS_AQUA_PROGRESS_V1" || !isSummary(payload.summary)) return;
      // 通信元とデータ形状は検証するが、これは正式な成績証明ではない。
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload.summary));
        setProgress(payload.summary);
        setMessage("PROJECT AQUAの進捗をこのブラウザに取り込みました。");
      } catch { setMessage("進捗を保存できませんでした。ブラウザの保存設定を確認してください。"); }
    }

    window.addEventListener("message", receive);
    // ポップアップを開いたAQUA画面に現在の進捗を要求する。
    if (window.opener) {
      window.opener.postMessage({ type: "ICS_AQUA_PROGRESS_REQUEST_V1" }, AQUA_ORIGIN);
    }
    return () => window.removeEventListener("message", receive);
  }, []);

  return (
    <section className="panel" aria-labelledby="aqua-progress-heading" style={{ marginTop: 20 }}>
      <div className="section-heading">
        <div><p className="eyebrow">PROJECT AQUA</p><h2 id="aqua-progress-heading">浄水場の学習進捗</h2></div>
      </div>
      {progress ? (
        <>
          <p><strong>{progress.complete ? "演習完了" : "演習中"}</strong> ・ 得点 <strong>{progress.score}/100点</strong></p>
          {([ ["RED TEAM", progress.redCompleted], ["BLUE TEAM", progress.blueCompleted] ] as const).map(([label, count]) => (
            <div key={label} style={{ marginTop: 15 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><strong>{label}</strong><span>{count}/5 完了</span></div>
              <progress value={count} max={5} aria-label={`${label}進捗`} style={{ width: "100%", height: 12 }} />
            </div>
          ))}
          <p className="small-note">最終共有日時：{new Date(progress.sharedAt).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}</p>
        </>
      ) : <p>まだ浄水場の進捗を取り込んでいません。PROJECT AQUAの通常演習を開いて「ICS Labに進捗を共有」を押してください。</p>}
      <div style={{ marginTop: 14 }}><a className="button button-outline" href={`${AQUA_ORIGIN}/labs/water-treatment/practice?start=1`}>PROJECT AQUAを開く →</a></div>
      {message && <p role="status" style={{ marginTop: 12 }}>{message}</p>}
      <p className="small-note" style={{ marginTop: 12 }}>表示されるのは同じブラウザに共有した参考記録です。Supabaseへの保存や別端末への同期、正式な修了認定には対応していません。練習モードの得点は取り込みません。</p>
    </section>
  );
}
