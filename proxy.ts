import { CookieMethodsServer, createServerClient } from "@supabase/ssr";
import { ProxyConfig, NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  return await refreshSupabaseAuth(request);
}

async function refreshSupabaseAuth(request: NextRequest) {
  let response = NextResponse.next({ request });

  const cookies: CookieMethodsServer = {
    getAll: () => request.cookies.getAll(),
    setAll: cookies => {
      cookies.forEach(c => request.cookies.set(c));
      response = NextResponse.next({ request });
      cookies.forEach(c => response.cookies.set(c));
    },
  };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createServerClient(url, key, { cookies });

  await supabase.auth.getUser();

  return response;
}

export const config: ProxyConfig = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
