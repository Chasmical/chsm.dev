export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NEXT_PUBLIC_SUPABASE_URL: string;
      readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      readonly SUPABASE_SERVICE_KEY?: string;
    }
  }
}