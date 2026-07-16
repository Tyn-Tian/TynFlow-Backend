import { SupabaseClient } from "@supabase/supabase-js";
import { ITransactionRepository } from "../domain/transaction/transaction.repository.interface";
import { Filters, Params, Transaction, TransactionDto } from "../domain/transaction/transaction.type";

export class TransactionRepository implements ITransactionRepository {
    constructor(private supabase: SupabaseClient) { }

    async getAll(params: Params, userId: string): Promise<{ transactions: Transaction[], count: number }> {
        let dateQuery = this.supabase
            .from("transactions")
            .select("date")
            .eq("user_id", userId)
            .order("date", { ascending: false });

        if (params.walletId) dateQuery = dateQuery.eq("wallet_id", params.walletId);
        if (params.budgetId) dateQuery = dateQuery.eq("budget_id", params.budgetId);
        if (params.month && params.year) {
            const startDate = `${params.year}-${params.month.padStart(2, '0')}-01`;
            const endDay = new Date(Number(params.year), Number(params.month), 0).getDate();
            const endDate = `${params.year}-${params.month.padStart(2, '0')}-${endDay}`;
            dateQuery = dateQuery.gte("date", startDate).lte("date", endDate);
        }

        const { data: dateData, error: dateError } = await dateQuery;
        if (dateError) throw new Error(dateError.message);

        const uniqueDates = Array.from(new Set((dateData ?? []).map(d => d.date)));
        const totalDates = uniqueDates.length;

        const from = (params.page - 1) * params.limit;
        const pageDates = uniqueDates.slice(from, from + params.limit);

        if (pageDates.length === 0) {
            return { transactions: [], count: totalDates };
        }

        let query = this.supabase
            .from("transactions")
            .select(
                "id, name, date, amount, type, budget_id, wallet_id, transfer_id, admin_fee, portfolio_id, budget:budgets(name), wallet:wallets!wallet_id(name), transfer:wallets!transfer_id(name), portfolio:portfolios(name)"
            )
            .eq("user_id", userId)
            .in("date", pageDates);

        if (params.walletId) query = query.eq("wallet_id", params.walletId);
        if (params.budgetId) query = query.eq("budget_id", params.budgetId);

        const { data, error } = await query
            .order("date", { ascending: false })

        if (error) throw new Error(error.message)
        
        return {
            transactions: data ?? [],
            count: totalDates 
        }
    }
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

        const { data, error } = await query.order("date", { ascending: false })

        if (error) throw new Error(error.message)
        return data ?? []
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