import { SupabaseClient } from "@supabase/supabase-js";
import { IBudgetRepository } from "../domain/budget/budget.repository.interface";
import { Budget, BudgetDto, Option } from "../domain/budget/budget.type";

export class BudgetRepository implements IBudgetRepository {
    constructor(private supabase: SupabaseClient) { }

    async getAll(userId: string): Promise<Omit<Budget, "daily_spending" | "total_spending">[]> {
        const { data, error } = await this.supabase
            .from("budgets")
            .select("id, name, total, leftover")
            .eq("user_id", userId)
            .is("deleted_at", null);

        if (error) throw new Error(error.message);
        return data ?? [];
    }
    async getOptions(userId: string, includeDeleted?: boolean): Promise<Option[]> {
        let query = this.supabase
            .from("budgets")
            .select("id, name, deleted_at")
            .eq("user_id", userId);

        if (!includeDeleted) {
            query = query.is("deleted_at", null)
        }

        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return data ?? [];
    }
    async getById(id: string, userId: string): Promise<Omit<Budget, "daily_spending" | "total_spending"> | null> {
        const { data, error } = await this.supabase
            .from("budgets")
            .select("id, name, total, leftover")
            .eq("id", id)
            .eq("user_id", userId)
            .single();

        if (error) throw new Error(error.message);
        return data;
    }
    async create(dto: BudgetDto, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("budgets")
            .insert({
                name: dto.name,
                total: dto.total,
                leftover: dto.leftover,
                user_id: userId,
            });

        if (error) throw new Error(error.message);
    }
    async update(id: string, dto: BudgetDto, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("budgets")
            .update({
                name: dto.name,
                total: dto.total,
                leftover: dto.leftover,
            })
            .eq("id", id)
            .eq("user_id", userId);

        if (error) throw new Error(error.message);
    }
    async delete(id: string, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("budgets")
            .update({
                deleted_at: new Date().toISOString(),
            })
            .eq("id", id)
            .eq("user_id", userId);

        if (error) throw new Error(error.message);
    }
}