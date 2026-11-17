export function RuntimeNotice() {
  return (
    <aside className="runtime-notice" aria-label="現在の開発状況">
      <span className="notice-icon" aria-hidden="true">i</span>
      <div><strong>変電設備のGRID LAB演習を利用できます。</strong><p>RED/BLUE各5ステージはログイン後に利用できます。浄水場と鉄道運行管理は準備中です。演習環境は架空の設備を模したDocker環境です。</p></div>
    </aside>
  );
}
