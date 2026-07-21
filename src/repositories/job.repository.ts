import { SupabaseClient } from "@supabase/supabase-js";
import { IJobRepository } from "../domain/job/job.repository.interface";
import { Job, JobDto, Params } from "../domain/job/job.type";

export class JobRepository implements IJobRepository {
    constructor(private supabase: SupabaseClient) { }

    async getAll(params: Params, userId: string): Promise<{ jobs: Job[], count: number }> {
        const { page, limit, search } = params
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = this.supabase
            .from('jobs')
            .select("id, position, company, source, status, applied_at, updated_at, deadline_at", { count: "exact" })
            .eq('user_id', userId);

        if (search) {
            query = query.or(`position.ilike.%${search}%,company.ilike.%${search}%`);
        }

        const { data, count, error } = await query
            .range(from, to)
            .order('updated_at', { ascending: false });

        if (error) throw error
        return {
            jobs: data ?? [],
            count: count ?? 0
        }
    }
    async getById(id: string, userId: string): Promise<Job> {
        const { data, error } = await this.supabase
            .from('jobs')
            .select("id, position, company, source, status, applied_at, updated_at, deadline_at")
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (error) throw error
        return data
    }
    async create(dto: JobDto, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from('jobs')
            .insert({
                ...dto,
                user_id: userId
            });

        if (error) throw error
    }
    async update(id: string, dto: JobDto, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from('jobs')
            .update(dto)
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error
    }
    async delete(id: string, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from('jobs')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error
    }
}