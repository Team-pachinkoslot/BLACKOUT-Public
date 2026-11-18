"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Team = "red" | "blue";
type ProgressRow = { team: Team; stage: number };

const missions: Record<Team, string[]> = {
  red: ["初期偵察", "サービス調査", "設定ファイル解析", "ログの相関分析", "最終監査報告"],
  blue: ["ベースライン確認", "ログ調査", "権限の確認", "異常検知", "監査報告"],
};

export default function ProgressDashboard() {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ProgressRow[]>([]);
  const [error, setError] = useState("");
  const [refreshId, setRefreshId] = useState(0);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      setError("Supabaseの環境変数が未設定です。");
      setLoading(false);
      return;
    }
    const supabase = createClient(url, key);
    setClient(supabase);
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          if (active) { setAuthenticated(false); setRows([]); }
          return;
        }
        if (active) setAuthenticated(true);
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session) throw new Error("セッションを確認できません。再ログインしてください。");
        const res = await fetch("/api/progress", {
          headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
          cache: "no-store",
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "進捗を取得できませんでした。");
        const progress: ProgressRow[] = Array.isArray(json.progress)
          ? json.progress.filter((item: unknown): item is ProgressRow => {
              if (!item || typeof item !== "object") return false;
              const p = item as Record<string, unknown>;
              return (p.team === "red" || p.team === "blue") &&
                Number.isInteger(p.stage) && (p.stage as number) >= 1 && (p.stage as number) <= 5;
            })
          : [];
        if (active) setRows(progress);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "進捗を取得できませんでした。");
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => { active = false; };
  }, [refreshId]);

  const cleared = (team: Team, stage: number) => rows.some((r) => r.team === team && r.stage === stage);
  const counts = {
    red: missions.red.filter((_, i) => cleared("red", i + 1)).length,
    blue: missions.blue.filter((_, i) => cleared("blue", i + 1)).length,
  };
  const total = counts.red + counts.blue;

  return (
    <section className="panel" aria-labelledby="learning-progress-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">MY PROGRESS</p>
          <h2 id="learning-progress-title">学習進捗</h2>
        </div>
        {authenticated && <button className="button button-outline" type="button" disabled={loading} onClick={() => setRefreshId((n) => n + 1)}>再読み込み</button>}
      </div>
      {loading ? <p role="status">ログインと進捗を確認しています…</p> : !authenticated ? (
        <div>
          <p>進捗の表示にはログインが必要です。</p>
          <Link className="button button-primary" href="/#ics-login" style={{ marginTop: 14 }}>トップページでログイン →</Link>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 26 }}>
            {([ ["合計", total, 10], ["RED TEAM", counts.red, 5], ["BLUE TEAM", counts.blue, 5] ] as const).map(([label, value, max]) => (
              <div key={label} style={{ background: "#f1f5f9", padding: 18, borderRadius: 8 }}>
                <p style={{ fontSize: 12, color: "#5a6979" }}>{label}</p>
                <strong style={{ display: "block", fontSize: 30, color: "#193b5a" }}>{value}<span style={{ fontSize: 15, color: "#6b7b8b" }}>/{max}</span></strong>
              </div>
            ))}
          </div>
          {(["red", "blue"] as const).map((team) => (
            <div key={team} style={{ marginBottom: 26 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h3>{team.toUpperCase()} TEAM</h3>
                <span>{counts[team]}/5 クリア</span>
              </div>
              <progress value={counts[team]} max={5} aria-label={`${team.toUpperCase()} TEAM進捗`} style={{ width: "100%", height: 12, accentColor: team === "red" ? "#bb5555" : "#2563a6" }} />
              <ul style={{ listStyle: "none", padding: 0, margin: "13px 0 0", display: "grid", gap: 8 }}>
                {missions[team].map((name, i) => (
                  <li key={name} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 10px", background: "#f7f9fb", borderRadius: 6 }}>
                    <span aria-hidden="true" style={{ color: cleared(team, i + 1) ? "#16835f" : "#7c8a9b" }}>{cleared(team, i + 1) ? "✓" : "○"}</span>
                    <span>{String(i + 1).padStart(2, "0")} {name}</span>
                    <span style={{ marginLeft: "auto", fontSize: 12, color: cleared(team, i + 1) ? "#16835f" : "#7c8a9b" }}>{cleared(team, i + 1) ? "クリア" : "未クリア"}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <Link className="button button-primary" href="/gridlab">GRID LABで演習を続ける →</Link>
        </>
      )}
      {error && <p role="alert" style={{ marginTop: 14, color: "#b42318" }}>{error}</p>}
      <p className="small-note" style={{ marginTop: 16 }}>クリア状況はSupabaseに保存されたデータを表示します。Docker接続は必要ありません。</p>
    </section>
  );
}
