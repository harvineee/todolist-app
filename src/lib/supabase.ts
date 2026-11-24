import "server-only";
import { createClient } from "@supabase/supabase-js";

export type Todo = {
  id: number;
  title: string;
  done: boolean;
  created_at: string;
};

// Server-only: the key never reaches the browser. Set these in Vercel / .env.local.
export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
