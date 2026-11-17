"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

export default function HomeAuth() {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      setMessage("Supabaseの環境変数が未設定です。");
      return;
    }
    const supabase = createClient(url, key);
    setClient(supabase);
    supabase.auth.getUser()
      .then(({ data, error }) => {
        if (error) setMessage("認証状態を確認できませんでした。");
        else setUser(data.user);
      })
      .catch(() => setMessage("認証状態を確認できませんでした。"));
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const result = mode === "login"
        ? await client.auth.signInWithPassword({ email, password })
        : await client.auth.signUp({ email, password });
      if (result.error) throw result.error;
      setPassword("");
      setMessage(mode === "signup" && !result.data.session
        ? "確認メールを送信しました。メール内のリンクから登録を完了してください。"
        : "ログインしました。下のボタンから演習へ進めます。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "認証に失敗しました。");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    if (!client) return;
    const { error } = await client.auth.signOut();
    setMessage(error ? error.message : "ログアウトしました。");
  }

  return (
    <section id="ics-login" className="home-auth" aria-labelledby="home-auth-title">
      <div className="home-auth-intro">
        <p className="eyebrow">ACCOUNT / GRID LAB</p>
        <h2 id="home-auth-title">演習アカウント</h2>
        <p>このページでログインすると、変電設備のRED / BLUE演習を利用できます。</p>
      </div>

      <div className="home-auth-controls">
        {user ? (
          <div className="home-auth-logged">
            <p>ログイン中：<strong>{user.email ?? "ユーザー"}</strong></p>
            <div className="home-auth-actions">
              <Link href="/labs/power-substation" className="button button-primary">変電設備の演習へ</Link>
              <Link href="/gridlab" className="button button-outline">GRID LABを直接開く</Link>
              <button className="home-auth-switch" type="button" onClick={logout}>ログアウト</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="home-auth-form">
            <label htmlFor="ics-login-email">メールアドレス</label>
            <input id="ics-login-email" type="email" autoComplete="email" required
              value={email} onChange={e => setEmail(e.target.value)} placeholder="example@mail.com" />
            <label htmlFor="ics-login-password">パスワード</label>
            <input id="ics-login-password" type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={6} required value={password}
              onChange={e => setPassword(e.target.value)} placeholder="6文字以上" />
            <div className="home-auth-actions">
              <button className="button button-primary" type="submit" disabled={!client || busy}>
                {busy ? "処理中..." : mode === "login" ? "ログイン" : "新規登録"}
              </button>
              <button className="home-auth-switch" type="button" onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setMessage("");
              }}>
                {mode === "login" ? "新規登録はこちら" : "ログインに戻る"}
              </button>
            </div>
          </form>
        )}
        {message && <p className="home-auth-message" role="status">{message}</p>}
      </div>
    </section>
  );
}
