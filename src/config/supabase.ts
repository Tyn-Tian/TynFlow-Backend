import { createClient } from "@supabase/supabase-js";
import type { Bindings } from "./env";

export function createSupabaseClient(env: Bindings, token?: string) {
    const options: any = {
        auth: { persistSession: false },
    };

    if (token) {
        options.global = {
            headers: { Authorization: `Bearer ${token}` }
        };
    }

    return createClient(
        env.SUPABASE_URL,
        env.SUPABASE_PUBLISHABLE_KEY,
        options
    );
}