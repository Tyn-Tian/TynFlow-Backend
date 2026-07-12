import { SupabaseClient } from "@supabase/supabase-js";
import { IWishlistRepository } from "../domain/wishlist/wishlist.repository.interface";
import { Params, Wishlist, WishlistDto } from "../domain/wishlist/wishlist.type";

export class WishlistRepository implements IWishlistRepository {
    constructor(private supabase: SupabaseClient) { }

    async getAll(params: Params, userId: string): Promise<{ wishlists: Wishlist[], count: number }> {
        const from = (params.page - 1) * params.limit;
        const to = from + params.limit - 1;

        let query = this.supabase
            .from("wishlists")
            .select("id, user_id, created_at, name, priority, status, price", { count: "exact" })
            .eq("user_id", userId);

        if (params.search) query = query.ilike("name", `%${params.search}%`);
        if (params.priority) query = query.eq("priority", params.priority);
        if (params.status) query = query.eq("status", params.status);

        const { data, count, error } = await query
            .order("priority", { ascending: true })
            .order("price", { ascending: true })
            .range(from, to);

        if (error) throw new Error(error.message)

        return {
            wishlists: data ?? [],
            count: count ?? 0
        }
    }
    async create(dto: WishlistDto, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("wishlists")
            .insert({
                ...dto,
                user_id: userId
            })

        if (error) throw new Error(error.message)
    }
    async update(id: string, dto: WishlistDto, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("wishlists")
            .update(dto)
            .eq("id", id)
            .eq("user_id", userId);

        if (error) throw new Error(error.message)
    }
    async delete(id: string, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("wishlists")
            .delete()
            .eq("id", id)
            .eq("user_id", userId);

        if (error) throw new Error(error.message)
    }
}