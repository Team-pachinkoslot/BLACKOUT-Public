
"use client";

import { useEffect, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Terminal } from "@xterm/xterm";
import type { FitAddon } from "@xterm/addon-fit";

type Props = {
  client: SupabaseClient | null;
  userId: string | null;
};

export default function LinuxTerminal({ client, userId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const readyRef = useRef(false);

  const [status, setStatus] = useState("OFFLINE");
  const [initialized, setInitialized] = useState(false);

  const endpoint = process.env.NEXT_PUBLIC_TERMINAL_WS_URL;

  useEffect(() => {
    let disposed = false;
    let term: Terminal | null = null;
    let observer: ResizeObserver | null = null;

    async function initialize() {
      const [{ Terminal }, { FitAddon }] = await Promise.all([
        import("@xterm/xterm"),
        import("@xterm/addon-fit")
      ]);

      if (disposed || !containerRef.current) return;

      term = new Terminal({
        cursorBlink: true,
        convertEol: true,
        fontSize: 14,
        fontFamily: "monospace",
        scrollback: 1500,
        theme: {
          background: "#020b10",
          foreground: "#b5f5ca",
          cursor: "#51e2b6"
        }
      });

      const fit = new FitAddon();
      term.loadAddon(fit);
      term.open(containerRef.current);
      fit.fit();

      terminalRef.current = term;
      fitRef.current = fit;

      term.writeln("GRID LAB v3 - Linux Cyber Range");
      term.writeln("ログイン後に接続ボタンを押してください。\r\n");

      term.onData(data => {
        const ws = socketRef.current;
        if (readyRef.current && ws?.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "input", data }));
        }
      });

      observer = new ResizeObserver(() => {
        if (!term || !containerRef.current) return;
        try {
          fit.fit();
          if (readyRef.current) {
            socketRef.current?.send(JSON.stringify({
              type: "resize",
              cols: term.cols,
              rows: term.rows
            }));
          }
        } catch {}
      });

      observer.observe(containerRef.current);
      setInitialized(true);
    }

    initialize().catch(() => setStatus("TERMINAL ERROR"));

    return () => {
      disposed = true;
      readyRef.current = false;
      socketRef.current?.close();
      socketRef.current = null;
      observer?.disconnect();
      term?.dispose();
      terminalRef.current = null;
      fitRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!userId) {
      readyRef.current = false;
      socketRef.current?.close();
      socketRef.current = null;
      setStatus("OFFLINE");
    }
  }, [userId]);

  async function connect() {
    if (!client || !userId || !initialized) return;

    if (!endpoint || !endpoint.startsWith("wss://")) {
      setStatus("WSS URL未設定");
      return;
    }

    const previous = socketRef.current;
    socketRef.current = null;
    readyRef.current = false;
    previous?.close();

    setStatus("認証情報を取得中...");

    const { data, error } = await client.auth.getSession();

    if (error || !data.session ||
        data.session.user.id !== userId) {
      setStatus("再ログインが必要です");
      return;
    }

    const token = data.session.access_token;
    const ws = new WebSocket(endpoint);
    socketRef.current = ws;

    terminalRef.current?.clear();
    terminalRef.current?.writeln("GRID LAB - 接続中...\r\n");
    setStatus("CONNECTING");

    ws.onmessage = event => {
      if (socketRef.current !== ws) return;

      let message: { type?: string; data?: string };
      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }

      if (message.type === "status") {
        if (message.data === "auth_required") {
          ws.send(JSON.stringify({
            type: "auth",
            access_token: token
          }));
          setStatus("AUTHENTICATING");
        }

        if (message.data === "starting") {
          setStatus("DOCKER STARTING");
        }

        if (message.data === "connected") {
          readyRef.current = true;
          setStatus("CONNECTED");

          const term = terminalRef.current;
          if (term) {
            ws.send(JSON.stringify({
              type: "resize",
              cols: term.cols,
              rows: term.rows
            }));
            term.focus();
          }
        }
      }

      if (message.type === "output" &&
          typeof message.data === "string") {
        terminalRef.current?.write(message.data);
      }

      if (message.type === "error") {
        terminalRef.current?.writeln(
          "\r\n[ERROR] " + (message.data ?? "不明なエラー")
        );
        setStatus("ERROR");
      }
    };

    ws.onerror = () => {
      if (socketRef.current === ws) {
        setStatus("CONNECTION ERROR");
      }
    };

    ws.onclose = () => {
      if (socketRef.current !== ws) return;
      socketRef.current = null;
      readyRef.current = false;
      setStatus("DISCONNECTED");
      terminalRef.current?.writeln(
        "\r\n[接続が終了しました]"
      );
    };
  }

  function disconnect() {
    readyRef.current = false;
    socketRef.current?.close();
    socketRef.current = null;
    setStatus("OFFLINE");
  }

  function sendInput(data: string) {
    const ws = socketRef.current;
    if (readyRef.current && ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "input", data }));
    }
  }

  return (
    <LinuxTerminal client={client} userId={user?.id ?? null} />
  );
}
