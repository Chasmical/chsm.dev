import "server-only";
import { cookies as getCookies } from "next/headers";
import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { createClient as createSupabaseClient, type SupabaseClientOptions } from "@supabase/supabase-js";
import type { Database, Supabase } from "./types";

export type { Database, Supabase };

type ReadonlyRequestCookies = Awaited<ReturnType<typeof getCookies>>;
type ClientOptions = SupabaseClientOptions<string & keyof Database> & { cookies: CookieMethodsServer };

function configureFetch(cookies: ReadonlyRequestCookies | null, next: NextFetchRequestConfig | undefined) {
  const options: ClientOptions = {
    cookies: {
      getAll: () => cookies?.getAll() ?? [],
      setAll: args => args.forEach(arg => cookies?.set(arg)),
    },
  };

  if (next) {
    options.global = { fetch: (input, init) => fetch(input, { ...init, next }) };
  } else {
    options.global = { fetch: (input, init) => fetch(input, { ...init, cache: "no-cache" }) };
  }
  return options;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

// Note: User clients MUST NOT cache request data, since it may vary between users.
//       Only anonymous and service role clients can cache request data.

export function createServerSupabase(role?: "user"): Promise<Supabase>;
export function createServerSupabase(role: "anonymous", next?: NextFetchRequestConfig): Supabase;
export function createServerSupabase(role: "SERVICE_ROLE", next?: NextFetchRequestConfig): Supabase;
export function createServerSupabase(role?: "user" | "anonymous" | "SERVICE_ROLE", next?: NextFetchRequestConfig) {
  switch (role || "user") {
    case "user":
      return getCookies().then(cookies => {
        return createServerClient(url, anonKey, configureFetch(cookies, next)) as Supabase;
      });
    case "anonymous":
      return createServerClient(url, anonKey, configureFetch(null, next)) as Supabase;
    case "SERVICE_ROLE":
      return createSupabaseClient(url, serviceKey!, configureFetch(null, next)) as Supabase;
    default:
      throw new Error("createServerSupabase was called with invalid client type.");
  }
}
