import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session?.user) return res;

  const redirectUrl = req.nextUrl.clone();
  redirectUrl.path = '/';
  redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
  return NextResponse.redirect(redirectUrl);
}

const newLocal = '/middleware-protected/:path*';
export const config = { matcher: newLocal };
