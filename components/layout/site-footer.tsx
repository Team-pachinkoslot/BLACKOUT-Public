export function SiteFooter({ appName }: { appName: string }) {
  return <footer className="site-footer"><div className="footer-inner"><p><strong>{appName}</strong><span>社会インフラの安全を、学びから。</span></p><p>変電設備の演習はGRID LABで提供<span className="footer-divider" aria-hidden="true">/</span>架空・隔離された環境</p></div></footer>;
}
