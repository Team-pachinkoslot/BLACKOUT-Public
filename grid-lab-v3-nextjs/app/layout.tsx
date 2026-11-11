import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'GRID LAB v3', description: '架空の変電所を舞台にしたサイバーセキュリティ演習プレビュー' };
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="ja"><body>{children}</body></html>}
