import { SupabaseClient } from "@supabase/supabase-js";
import { IPortfolioRepository } from "../domain/portfolio/portfolio.repository.interface";
import { Portfolio, PortfolioDto, PortfolioSnapshot } from "../domain/portfolio/portfolio.type";

export class PortfolioRepository implements IPortfolioRepository {
    constructor(private supabase: SupabaseClient) { }

    async getAll(userId: string): Promise<Portfolio[]> {
        const { data, error } = await this.supabase
            .from("portfolios")
            .select("id, name, type, target, invested, current_value")
            .eq("user_id", userId)
            .order("name", { ascending: true });

        if (error) throw new Error(error.message);
        return data ?? [];
    }
    async getById(id: string, userId: string): Promise<Portfolio> {
        const { data, error } = await this.supabase
            .from("portfolios")
            .select("id, name, type, target, invested, current_value, user_id")
            .eq("user_id", userId)
            .eq("id", id)
            .single();

        if (error) throw new Error(error.message);
        return data;
    }
    async create(dto: PortfolioDto, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("portfolios")
            .insert({ ...dto, user_id: userId });

        if (error) throw new Error(error.message);
    }
    async update(id: string, dto: PortfolioDto, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("portfolios")
            .update(dto)
            .eq("id", id)
            .eq("user_id", userId);

        if (error) throw new Error(error.message);
    }
    async delete(id: string, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("portfolios")
            .delete()
            .eq("user_id", userId)
            .eq("id", id);

        if (error) throw new Error(error.message);
    }
    async getSnapshot(userId: string): Promise<PortfolioSnapshot[]> {
        const { data, error } = await this.supabase
            .from("portfolio_snapshots")
            .select("id, created_at, invested, current_value, user_id")
            .eq("user_id", userId)
            .order("created_at", { ascending: true });

        if (error) throw new Error(error.message);
        return data ?? [];
    }
}