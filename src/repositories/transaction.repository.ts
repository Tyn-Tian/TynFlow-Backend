import { SupabaseClient } from "@supabase/supabase-js";
import { ITransactionRepository } from "../domain/transaction/scheduler.repository.interface";
import { Filters, Transaction, TransactionDto } from "../domain/transaction/transaction.type";

export class TransactionRepository implements ITransactionRepository {
    constructor(private supabase: SupabaseClient) { }

    async findTransactions(filters: Filters, userId: string): Promise<Transaction[]> {
        let query = this.supabase
            .from("transactions")
            .select(
                "id, name, date, amount, type, budget_id, wallet_id, transfer_id, admin_fee, portfolio_id",
            )
            .eq("user_id", userId);

        if (filters.type) {
            query = query.eq("type", filters.type);
        }
        if (filters.startDate) {
            query = query.gte("date", filters.startDate);
        }
        if (filters.endDate) {
            query = query.lte("date", filters.endDate);
        }
        if (filters.walletId) {
            query = query.or(
                `wallet_id.eq.${filters.walletId},transfer_id.eq.${filters.walletId}`,
            );
        }
        if (filters.budgetId) {
            query = query.eq("budget_id", filters.budgetId);
        }
        if (filters.dates && filters.dates.length > 0) {
            query = query.in("date", filters.dates);
        }

        const { data, error } = await query.order("date", { ascending: false })

        if (error) throw new Error(error.message)
        return data ?? []
    }
    async findTransactionDates(filters: { walletId?: string; budgetId?: string; }, userId: string): Promise<{ date: string }[]> {
        let query = this.supabase
            .from("transactions")
            .select("date")
            .eq("user_id", userId);

        if (filters.walletId) {
            query = query.or(
                `wallet_id.eq.${filters.walletId},transfer_id.eq.${filters.walletId}`,
            );
        }
        if (filters.budgetId) {
            query = query.eq("budget_id", filters.budgetId);
        }

        const { data, error } = await query.order("date", { ascending: false })

        if (error) throw new Error(error.message)
        return data ?? []
    }
    async findEarliestTransaction(userId: string): Promise<{ date: string }> {
        const { data, error } = await this.supabase
            .from("transactions")
            .select("date")
            .eq("user_id", userId)
            .order("date", { ascending: true })
            .limit(1)
            .single();

        if (error) throw new Error(error.message)
        return data ?? null
    }
    async getById(id: string, userId: string): Promise<Transaction> {
        const { data, error } = await this.supabase
            .from("transactions")
            .select(
                "id, name, date, amount, type, budget_id, wallet_id, transfer_id, admin_fee, portfolio_id",
            )
            .eq("user_id", userId)
            .eq("id", id)
            .single();

        if (error) throw new Error(error.message)
        return data ?? null
    }
    async create(dto: TransactionDto, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("transactions")
            .insert({ ...dto, user_id: userId });

        if (error) throw new Error(error.message)
    }
    async update(id: string, dto: TransactionDto, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("transactions")
            .update({ ...dto, user_id: userId })
            .eq("id", id)
            .eq("user_id", userId);

        if (error) throw new Error(error.message)
    }
    async delete(id: string, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("transactions")
            .delete()
            .eq("id", id)
            .eq("user_id", userId);

        if (error) throw new Error(error.message)
    }
}