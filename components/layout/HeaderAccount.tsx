"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";

export default function HeaderAccount() {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) { setError("認証設定がありません"); setReady(true); return; }
    const supabase = createClient(url, key);
    setClient(supabase);
    let active = true;
    supabase.auth.getUser().then(({data,error}) => {
      if (!active) return;
      if (!error) setUser(data.user);
      setReady(true);
    }).catch(() => { if(active) setReady(true); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if(active) { setUser(session?.user ?? null); setReady(true); }
    });
    return () => { active=false; subscription.unsubscribe(); };
  }, []);
  async function signOut() {
    if (!client || busy) return;
    setBusy(true); setError("");
    try {
      const {error} = await client.auth.signOut();
      if(error) throw error;
      setUser(null);
      if(pathname!=="/") router.push("/");
      else router.refresh();
    } catch(e) {
      setError(e instanceof Error ? e.message : "ログアウトできませんでした");
    } finally {setBusy(false);}
  }
  return <div className="ics-header-account" aria-label="アカウント">
    {!ready ? <span className="ics-header-user">認証確認中…</span> : user ? <>
      <span className="ics-header-user" title={user.email || ""}>{user.email || "ログイン中"}</span>
      <button type="button" className="ics-header-logout" onClick={signOut} disabled={busy}>{busy ? "処理中…" : "ログアウト"}</button>
    </> : <Link href="/#ics-login" className="ics-header-login">ログイン</Link>}
    {error && <span className="ics-header-error" role="status">{error}</span>}
  </div>;
}
