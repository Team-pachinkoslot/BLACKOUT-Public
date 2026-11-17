
"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

type AuthStatus = "checking" | "authenticated" | "guest";

export default function AccessGate({
  children,
}: {
  children: ReactNode;
}) {
  const [status, setStatus] = useState<AuthStatus>("checking");

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      setStatus("guest");
      return;
    }

    const supabase = createClient(url, key);
    let active = true;

    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (!active) return;

        setStatus(
          !error && data.user ? "authenticated" : "guest"
        );
      } catch {
        if (active) setStatus("guest");
      }
    };

    checkUser();

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event) => {
        if (!active) return;

        if (event === "SIGNED_OUT") {
          setStatus("guest");
        } else if (event === "SIGNED_IN") {
          checkUser();
        }
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (status === "checking") {
    return (
      <div style={{
        padding: "100px 20px",
        textAlign: "center",
      }}>
        <h2>認証を確認しています...</h2>
        <p>ログイン状態を確認しています。</p>
      </div>
    );
  }

  if (status === "guest") {
    return (
      <main style={{
        maxWidth: 520,
        margin: "70px auto",
        padding: 32,
        textAlign: "center",
        background: "#142137",
        color: "#e2eafa",
        border: "1px solid #355476",
        borderRadius: 16,
      }}>
        <div style={{ fontSize: 42, marginBottom: 16 }}>🔒</div>

        <h2>ログインが必要です</h2>

        <p style={{
          lineHeight: 1.9,
          color: "#a9bdd8",
          marginBottom: 28,
        }}>
          GRID LABの演習を利用するには、
          ICS Labへのログインが必要です。
        </p>

        <Link
          href="/#ics-login"
          style={{
            display: "inline-block",
            background: "#205b9d",
            color: "#ffffff",
            padding: "13px 28px",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          ログイン画面へ進む →
        </Link>
      </main>
    );
  }

  return <>{children}</>;
}
