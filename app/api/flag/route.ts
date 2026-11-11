import {NextRequest,NextResponse} from 'next/server';
import {timingSafeEqual} from 'node:crypto';
import {authenticate} from '../_lib/auth';
export const runtime='nodejs';

type Team='red'|'blue';
const validTeams=new Set(['red','blue']);
function equalFlag(a:string,b:string){
 const left=Buffer.from(a,'utf8'),right=Buffer.from(b,'utf8');
 return left.length===right.length&&timingSafeEqual(left,right);
}
export async function POST(request:NextRequest){
 try{
  const auth=await authenticate(request);
  if(!auth)return NextResponse.json({error:'ログインが必要です'},{status:401});
  const body=await request.json().catch(()=>null);
  const team=body?.team as Team,stage=body?.stage,flag=body?.flag;
  if(!validTeams.has(team)||!Number.isInteger(stage)||stage<1||stage>5||typeof flag!=='string'||flag.length>160)
   return NextResponse.json({error:'入力内容が正しくありません'},{status:400});
  const raw=process.env.GRIDLAB_FLAGS_JSON;
  if(!raw)return NextResponse.json({error:'FLAG設定が未完了です'},{status:503});
  const flags=JSON.parse(raw) as Record<Team,Record<string,string>>;
  const expected=flags?.[team]?.[String(stage)];
  if(typeof expected!=='string'||!expected)return NextResponse.json({error:'ステージの設定が未完了です'},{status:503});
  if(!equalFlag(flag.trim(),expected))return NextResponse.json({correct:false});
  const {error}=await auth.admin.from('user_progress').upsert({user_id:auth.user.id,team,stage},{onConflict:'user_id,team,stage',ignoreDuplicates:true});
  if(error)throw error;
  return NextResponse.json({correct:true});
 }catch(e){console.error('flag API error',e);return NextResponse.json({error:'FLAG判定に失敗しました'},{status:500});}
}
