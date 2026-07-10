import type { Context, Next } from "hono";
import { createSupabaseClient } from "../config/supabase";
import { createClient } from "@supabase/supabase-js";

export async function injectSupabase(c: Context, next: Next) {
    const authHeader = c.req.header("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : undefined;

    const supabase = createSupabaseClient(c.env, token);
    c.set("supabase", supabase);
    await next();
}

export async function requireAuth(c: Context, next: Next) {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return c.json({ success: false, message: "Unauthorized" }, 401);
    }

    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
        return c.json({ success: false, message: "Unauthorized" }, 401);
    }

    c.set("userId", data.user.id);

    await next();
}