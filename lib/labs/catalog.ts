import type { Lab } from "./types";

/** 画面とAPIが共有する唯一のシナリオデータ。時間は仮設定。 */
export const labCatalog: readonly Lab[] = [
  {
    id: "water-01",
    slug: "water-treatment",
    title: "浄水場へのサイバー攻撃",
    description:
      "水位・水圧・ポンプ・バルブに関する異常を調査し、模擬設備を安全な状態に戻すことを目標とする演習です。",
    difficulty: "beginner",
    status: "coming_soon",
    objectives: ["異常値の特定", "安全停止", "復旧"],
    assets: ["タンク", "ポンプ", "バルブ", "センサー"],
    estimatedMinutes: 30,
    levels: [
      {
        difficulty: "beginner",
        title: "異常値の確認",
        description:
          "センサー値の上昇と警告ログを確認し、設備が異常な状態になっている箇所を特定するステップです。",
        objectives: ["水位と圧力の異常を特定", "警告の発生箇所を確認", "異常時の初動を理解"],
        assets: ["タンク計測値", "警報ログ", "水位センサー"],
        estimatedMinutes: 10,
      },
    ],
  },
  {
    id: "power-01",
    slug: "power-substation",
    title: "変電設備の異常対応",
    description:
      "仮想設備で発生した不正操作イベントや状態変化を、操作履歴・監視データから調査する演習です。",
    difficulty: "intermediate",
    status: "available",
    objectives: ["不正操作の発見", "封じ込め"],
    assets: ["変電設備", "開閉器", "計測値"],
    estimatedMinutes: 45,
    levels: [
      {
        difficulty: "intermediate",
        title: "不正操作の切り分け",
        description:
          "計測値の急変と操作ログの差異を比較し、故障と不正操作の切り分けを進めます。",
        objectives: ["異常要因を切り分け", "不正操作のパターンを特定", "影響箇所を限定"],
        assets: ["負荷計測", "ログ比較", "制御パネル"],
        estimatedMinutes: 18,
      },
    ],
  },
  {
    id: "rail-01",
    slug: "railway-operations",
    title: "鉄道運行管理システム",
    description:
      "模擬運行情報・列車位置・ダイヤの不整合を検知し、安全確認できない場合は運行を保留する判断を学ぶ演習です。",
    difficulty: "advanced",
    status: "coming_soon",
    objectives: ["運行情報不整合の検知", "安全な運行判断"],
    assets: ["仮想列車", "運行情報", "ダイヤ"],
    estimatedMinutes: 60,
    levels: [
      {
        difficulty: "advanced",
        title: "復旧と再開条件の検討",
        description:
          "一時停止後の再開に必要な安全確認と、異常が残る場合の運用制限を設計する上級レベルです。",
        objectives: ["再開条件を定義", "運用制限の影響を試算", "安全確保の判断をまとめる"],
        assets: ["再開計画", "安全確認チェック", "列車運行表"],
        estimatedMinutes: 18,
      },
    ],
  },
];
