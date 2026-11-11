import {createClient} from '@supabase/supabase-js';
import {NextRequest} from 'next/server';

export async function authenticate(request:NextRequest){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const publishable=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 const secret=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!publishable||!secret)throw new Error('サーバー設定が未完了です');
 const token=request.headers.get('authorization')?.match(/^Bearer (.+)$/i)?.[1];
 if(!token)return null;
 const authClient=createClient(url,publishable,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data,error}=await authClient.auth.getUser(token);
 if(error||!data.user)return null;
 const admin=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
 return {user:data.user,admin};
}
