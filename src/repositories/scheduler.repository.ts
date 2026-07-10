import { SupabaseClient } from "@supabase/supabase-js";
import { ISchedulerRepository } from "../domain/scheduler/scheduler.repository.interface";
import { Scheduler, SchedulerDto } from "../domain/scheduler/scheduler.type";

export class SchedulerRepository implements ISchedulerRepository {
    constructor(private supabase: SupabaseClient) { }

    async getAll(userId: string): Promise<Scheduler[]> {
        const { data, error } = await this.supabase
            .from("schedulers")
            .select("id, name, type, amount, frequency, next_run_date, status, budget_id, wallet_id, transfer_id, portfolio_id, admin_fee")
            .eq("user_id", userId)
            .order("name", { ascending: true });

        if (error) throw new Error(error.message);
        return data ?? [];
    }
    async create(dto: SchedulerDto, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("schedulers")
            .insert([{ ...dto, user_id: userId }])
            .select();

        if (error) throw new Error(error.message);
    }
    async update(id: string, dto: SchedulerDto, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("schedulers")
            .update(dto)
            .eq("id", id)
            .eq("user_id", userId)
            .select();

        if (error) throw new Error(error.message);
    }
    async deactive(id: string, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("schedulers")
            .update({ status: "Inactive" })
            .eq("id", id)
            .eq("user_id", userId)
            .select();

        if (error) throw new Error(error.message);
    }
    async activate(id: string, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("schedulers")
            .update({ status: "Active" })
            .eq("id", id)
            .eq("user_id", userId)
            .select();

        if (error) throw new Error(error.message);
    }
    async delete(id: string, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("schedulers")
            .delete()
            .eq("id", id)
            .eq("user_id", userId);

        if (error) throw new Error(error.message);
    }
}