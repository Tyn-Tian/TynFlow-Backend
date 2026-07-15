export type Bindings = {
    SUPABASE_URL: string;
    SUPABASE_PUBLISHABLE_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
};

export type Variables = {
    supabase: ReturnType<typeof import("@supabase/supabase-js").createClient>;
    userId?: string;
    email?: string;
};