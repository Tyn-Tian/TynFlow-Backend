import { SupabaseClient } from "@supabase/supabase-js";
import { IWalletRepository } from "../domain/wallet/wallet.repository.interface";
import { Wallet, WalletDto } from "../domain/wallet/wallet.type";

export class WalletRepository implements IWalletRepository {
    constructor(private supabase: SupabaseClient) { }

    async getAll(userId: string): Promise<Wallet[]> {
        const { data, error } = await this.supabase
            .from("wallets")
            .select("id, name, type, balance")
            .eq("user_id", userId)
            .order("name", { ascending: true });

        if (error) throw error;
        return data ?? [];
    }
    async getById(id: string, userId: string): Promise<Wallet | null> {
        const { data, error } = await this.supabase
            .from("wallets")
            .select("id, name, type, balance")
            .eq("id", id)
            .eq("user_id", userId)
            .single();

        if (error) throw error;
        return data;
    }
    async create(dto: WalletDto, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("wallets")
            .insert({
                name: dto.name,
                type: dto.type,
                balance: dto.balance,
                user_id: userId
            });

        if (error) throw new Error(error.message);
    }
    async update(id: string, dto: WalletDto, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("wallets")
            .update({
                name: dto.name,
                type: dto.type,
                balance: dto.balance
            })
            .eq("id", id)
            .eq("user_id", userId);

        if (error) throw new Error(error.message);
    }
    async delete(id: string, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("wallets")
            .delete()
            .eq("id", id)
            .eq("user_id", userId);

        if (error) throw new Error(error.message);
    }
}