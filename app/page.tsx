"use client";
import {useEffect,useState} from 'react';
import {createClient, type SupabaseClient, type User} from '@supabase/supabase-js';

type Team = 'red'|'blue';
const missions:Record<Team,[string,string][]> = {
 red:[['初期偵察','Linux環境を調査し、/opt/gridlab/flag.txt を見つけよう。'],['サービス調査','架空のサービス台帳を調査しよう。'],['設定ファイル解析','模擬設定ファイルを調査しよう。'],['ログの相関分析','ログを時系列で調査しよう。'],['最終監査報告','監査資料を調査しよう。']],
 blue:[['ベースライン確認','正常値と観測値を比較しよう。'],['ログ調査','ログイン履歴を調査しよう。'],['権限の確認','危険なファイル権限を調査しよう。'],['異常検知','アラートとイベントを照合しよう。'],['監査報告','調査結果をまとめよう。']]
};
export default function Home(){
 const [team,setTeam]=useState<Team>('red');
 const [client,setClient]=useState<SupabaseClient|null>(null);
 const [user,setUser]=useState<User|null>(null);
 const [email,setEmail]=useState('');
 const [password,setPassword]=useState('');
 const [authMode,setAuthMode]=useState<'login'|'signup'>('login');
 const [authMessage,setAuthMessage]=useState('');
 const [authBusy,setAuthBusy]=useState(false);
 useEffect(()=>{
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key){setAuthMessage('Supabaseの環境変数が未設定です。');return;}
  const supabase=createClient(url,key);
  setClient(supabase);
  supabase.auth.getUser().then(({data})=>setUser(data.user)).catch(()=>setAuthMessage('認証状態を確認できませんでした。'));
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>setUser(session?.user??null));
  return ()=>subscription.unsubscribe();
 },[]);
 const submitAuth=async(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();if(!client)return;
  setAuthBusy(true);setAuthMessage('');
  try{
   const result=authMode==='signup' ? await client.auth.signUp({email,password}) : await client.auth.signInWithPassword({email,password});
   if(result.error)throw result.error;
   setAuthMessage(authMode==='signup'&&!result.data.session?'確認メールを送信しました。メール内のリンクから登録を完了してください。':'認証しました。');
   setPassword('');
  }catch(err){setAuthMessage(err instanceof Error?err.message:'認証に失敗しました。');}
  finally{setAuthBusy(false);}
 };
 const logout=async()=>{if(!client)return;const {error}=await client.auth.signOut();if(error)setAuthMessage(error.message);};
 const [stage,setStage]=useState(0);
 const choose=(t:Team)=>{setTeam(t);setStage(0)};
 return <>
 <header><div className="wrap head"><h1>⚡ <span>GRID LAB</span> <small>/ LINUX CYBER RANGE v3</small></h1><div id="connection">● VERCEL / PREVIEW MODE</div></div></header>
 <main className="wrap">
 <section className="panel" aria-label="ユーザー認証" style={{marginTop:16}}>
  <h2>アカウント</h2>
  {user?<div><p>ログイン中：{user.email}</p><button onClick={logout}>ログアウト</button></div>:
   <form onSubmit={submitAuth} style={{display:'flex',flexWrap:'wrap',gap:10,alignItems:'center'}}>
    <input aria-label="メールアドレス" type="email" placeholder="メールアドレス" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} style={{padding:10}}/>
    <input aria-label="パスワード" type="password" placeholder="パスワード（6文字以上）" minLength={6} autoComplete={authMode==='signup'?'new-password':'current-password'} required value={password} onChange={e=>setPassword(e.target.value)} style={{padding:10}}/>
    <button type="submit" disabled={!client||authBusy}>{authMode==='signup'?'新規登録':'ログイン'}</button>
    <button type="button" onClick={()=>{setAuthMode(authMode==='signup'?'login':'signup');setAuthMessage('');}}>{authMode==='signup'?'ログインへ切替':'新規登録へ切替'}</button>
   </form>}
  <p role="status">{authMessage}</p>
  <p className="hint">演習ターミナルとFLAG判定は引き続き無効です。ログインだけではDockerに接続できません。</p>
 </section>
 <nav className="actions" aria-label="演習メニュー">
 <button className={team==='red'?'selected':''} onClick={()=>choose('red')}>RED TEAM / 攻撃者</button>
 <button className={team==='blue'?'selected':''} onClick={()=>choose('blue')}>BLUE TEAM / 防御者</button>
 <button onClick={()=>setStage(0)}>現在のステージを初期化</button>
 <button onClick={()=>choose('red')}>全進捗をリセット</button>
 </nav>
 <div className="layout"><div className="left">
 <section className="panel"><h2>変電所ステータス <small>（演習用の模擬値）</small></h2><div className="stats"><div>母線電圧<strong>66.0 kV</strong></div><div>周波数<strong>50.0 Hz</strong></div><div>設備状態<strong>正常</strong></div></div></section>
 <section className="panel"><h2>{team==='red'?'RED':'BLUE'} TEAM ミッション</h2><p id="progress">公開プレビュー / 全10ステージ</p><div id="stages">{missions[team].map(([name],i)=><button key={i} className={'stage'+(stage===i?' active':'')} onClick={()=>setStage(i)}>▶ {String(i+1).padStart(2,'0')} {name}</button>)}</div></section>
 <section className="panel"><h2>ミッション詳細</h2><h3>{String(stage+1).padStart(2,'0')} {missions[team][stage][0]}</h3><p>{missions[team][stage][1]}</p><label htmlFor="flag">FLAGを提出</label><div className="flagRow"><input id="flag" placeholder="FLAG{...}" autoComplete="off" disabled/><button disabled>提出</button></div><p id="flagResult" role="status">プレビュー版のためFLAG判定は無効です。</p></section>
 </div><div className="right">
 <section className="panel"><div className="terminalHeading"><h2>Linuxターミナル（プレビュー）</h2><span id="terminalStatus">● PREVIEW ONLY</span></div><p className="hint">公開プレビュー：Docker接続は未実装です。実際のLinux操作はRaspberry Pi側で行います。</p><div id="terminal" style={{whiteSpace:'pre-wrap',color:'#91f2bf',font:'15px/1.6 monospace',padding:18,overflow:'auto'}}>{'GRID LAB v3 - PUBLIC PREVIEW\n\nLinuxターミナルはまだ接続されていません。\nRaspberry Piのバックエンドを安全に公開した後で有効になります。\n\n$ _'.replaceAll('\\n','\n')}</div><div className="terminalButtons"><button disabled>画面クリア</button><button disabled>Ctrl+C</button><button disabled>再接続</button></div></section>
 <section className="panel"><h2>操作ガイド</h2><p>最初のステージでは <code>ls /opt/gridlab</code> と <code>cat /opt/gridlab/flag.txt</code> を試してみよう。</p><p className="hint">この公開ページは画面確認用です。Linuxターミナル・FLAG判定は安全なバックエンドを準備してから有効にします。</p></section>
 </div></div></main>
 </>;
}
