
"use client";

import { useEffect, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Terminal } from "@xterm/xterm";
import type { FitAddon } from "@xterm/addon-fit";

type Team = "red" | "blue";

type Props = {
  client: SupabaseClient | null;
  userId: string | null;
  team: Team;
  stage: number;
};

export default function LinuxTerminal({
  client,
  userId,
  team,
  stage
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const readyRef = useRef(false);

  const [status, setStatus] = useState("OFFLINE");
  const [initialized, setInitialized] = useState(false);

  const endpoint = process.env.NEXT_PUBLIC_TERMINAL_WS_URL;

  // ターミナル初期化
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
      term.writeln(
        `演習環境: ${team.toUpperCase()} TEAM / STAGE ${stage}`
      );
      term.writeln("接続ボタンを押してください。\r\n");

      term.onData(data => {
        const ws = socketRef.current;

        if (
          readyRef.current &&
          ws?.readyState === WebSocket.OPEN
        ) {
          ws.send(JSON.stringify({
            type: "input",
            data
          }));
        }
      });

      observer = new ResizeObserver(() => {
        if (!term || !containerRef.current) return;

        try {
          fit.fit();

          const ws = socketRef.current;

          if (
            readyRef.current &&
            ws?.readyState === WebSocket.OPEN
          ) {
            ws.send(JSON.stringify({
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

    initialize().catch(() => {
      if (!disposed) {
        setStatus("TERMINAL ERROR");
      }
    });

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
  }, [team, stage]);

  // ログアウト時は接続を終了
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

    try {
      const { data, error } = await client.auth.getSession();

      if (
        error ||
        !data.session ||
        data.session.user.id !== userId
      ) {
        setStatus("再ログインが必要です");
        return;
      }

      const token = data.session.access_token;
      const ws = new WebSocket(endpoint);

      socketRef.current = ws;

      terminalRef.current?.clear();
      terminalRef.current?.writeln(
        `GRID LAB / ${team.toUpperCase()} STAGE ${stage}`
      );
      terminalRef.current?.writeln(
        "Docker環境に接続中...\r\n"
      );

      setStatus("CONNECTING");

      ws.onmessage = event => {
        if (socketRef.current !== ws) return;

        let message: {
          type?: string;
          data?: string;
        };

        try {
          message = JSON.parse(event.data);
        } catch {
          return;
        }

        if (message.type === "status") {
          if (message.data === "auth_required") {
            ws.send(JSON.stringify({
              type: "auth",
              access_token: token,
              team,
              stage
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

        if (
          message.type === "output" &&
          typeof message.data === "string"
        ) {
          terminalRef.current?.write(message.data);
        }

        if (message.type === "error") {
          terminalRef.current?.writeln(
            "\r\n[ERROR] " +
            (message.data ?? "不明なエラー")
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
    } catch {
      setStatus("CONNECTION ERROR");
    }
  }

  function disconnect() {
    readyRef.current = false;
    socketRef.current?.close();
    socketRef.current = null;
    setStatus("OFFLINE");
  }

  function sendInput(data: string) {
    const ws = socketRef.current;

    if (
      readyRef.current &&
      ws?.readyState === WebSocket.OPEN
    ) {
      ws.send(JSON.stringify({
        type: "input",
        data
      }));
    }
  }

  return (
    <section className="panel">
      <div className="terminalHeading">
        <h2>
          Linuxターミナル
        </h2>
        <span>● {status}</span>
      </div>

      <p className="hint">
        {team.toUpperCase()} TEAM /
        STAGE {stage} 専用Docker環境
      </p>

      <div
        id="terminal"
        ref={containerRef}
        style={{
          padding: 8,
          overflow: "hidden"
        }}
      />

      <div className="terminalButtons">
        <button
          onClick={connect}
          disabled={!client || !userId || !initialized}
        >
          接続 / 再接続
        </button>

        <button
          onClick={() => terminalRef.current?.clear()}
        >
          画面クリア
        </button>

        <button
          onClick={() => sendInput("\x03")}
        >
          Ctrl+C
        </button>

        <button onClick={disconnect}>
          切断
        </button>
      </div>
    </section>
  );
}
