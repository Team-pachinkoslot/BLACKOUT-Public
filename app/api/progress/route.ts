import {NextRequest,NextResponse} from 'next/server';
import {authenticate} from '../_lib/auth';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(request:NextRequest){
 try{
  const auth=await authenticate(request);
  if(!auth)return NextResponse.json({error:'ログインが必要です'},{status:401});
  const {data,error}=await auth.admin.from('user_progress').select('team,stage').eq('user_id',auth.user.id);
  if(error)throw error;
  return NextResponse.json({progress:data??[]},{headers:{'Cache-Control':'no-store'}});
 }catch(e){console.error('progress API error',e);return NextResponse.json({error:'進捗を取得できませんでした'},{status:500});}
}
