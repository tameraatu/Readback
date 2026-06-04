import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured");
  }
  return url;
}

/**
 * Browser-safe client — uses anon key, respects RLS.
 * Use in Client Components only.
 */
export function createBrowserClient(): SupabaseClient {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured");
  }
  return createClient(getSupabaseUrl(), anonKey);
}

/**
 * Server-side admin client — uses service role key, bypasses RLS.
 * Use only in Server Components and API routes; never expose to the client.
 */
export function createServerClient(): SupabaseClient {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }
  return createClient(getSupabaseUrl(), serviceRoleKey, {
    auth: { persistSession: false },
  });
}
