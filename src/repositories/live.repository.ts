import { SupabaseClient } from "@supabase/supabase-js";
import { Live, LiveDto } from "../domain/live/live.type";
import { ILiveRepository } from "../domain/live/live.repository.interface";

export class LiveRepository implements ILiveRepository {
    constructor(private supabase: SupabaseClient) { }

    async getAll(userId: string): Promise<Live[]> {
        const { data, error } = await this.supabase
            .from("lives")
            .select("id, date, type, tiktok, shopee, remark, user_id, created_at")
            .eq("user_id", userId)
            .order("date", { ascending: false })
            .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);
        return data ?? [];
    }
    async getById(id: string, userId: string): Promise<Live> {
        const { data, error } = await this.supabase
            .from("lives")
            .select("id, date, type, tiktok, shopee, remark, user_id, created_at")
            .eq("id", id)
            .eq("user_id", userId)
            .single();

        if (error) throw new Error(error.message);
        return data;
    }
    async create(dto: LiveDto, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("lives")
            .insert({
                ...dto,
                user_id: userId,
            });

        if (error) throw new Error(error.message);
    }
    async update(id: string, dto: LiveDto, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("lives")
            .update(dto)
            .eq("id", id)
            .eq("user_id", userId);

        if (error) throw new Error(error.message);
    }
    async delete(id: string, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("lives")
            .delete()
            .eq("id", id)
            .eq("user_id", userId);

        if (error) throw new Error(error.message);
    }
}