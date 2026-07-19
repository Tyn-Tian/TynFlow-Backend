import { SupabaseClient } from "@supabase/supabase-js";
import { IWishlistRepository } from "../domain/wishlist/wishlist.repository.interface";
import { Params, Wishlist, WishlistDto } from "../domain/wishlist/wishlist.type";

export class WishlistRepository implements IWishlistRepository {
    constructor(private supabase: SupabaseClient) { }

    async getAll(): Promise<{ wishlists: Wishlist[], count: number }> {
        let query = this.supabase
            .from("wishlists")
            .select("id, user_id, created_at, name, priority, status, price", { count: "exact" });

        const { data, count, error } = await query
            .order("priority", { ascending: true })
            .order("price", { ascending: true });

        if (error) throw new Error(error.message)

        const wishlistsData = data ?? [];

        const userIds = [...new Set(wishlistsData.map(w => w.user_id))];
        if (userIds.length > 0) {
            const { data: profilesData, error: profilesError } = await this.supabase
                .from("profiles")
                .select("user_id, name")
                .in("user_id", userIds);

            if (!profilesError && profilesData) {
                const profileMap = new Map(profilesData.map(p => [p.user_id, p]));
                wishlistsData.forEach(w => {
                    (w as any).profiles = profileMap.get(w.user_id) || null;
                });
            }
        }

        return {
            wishlists: wishlistsData as unknown as Wishlist[],
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
    async change(id: string, status: string, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("wishlists")
            .update({ status })
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