import { SupabaseClient } from "@supabase/supabase-js";
import { IAuthRepository } from "../domain/auth/auth.repository.interface";
import { Profile, ProfileDto } from "../domain/auth/auth.type";

export class AuthRepository implements IAuthRepository {
    constructor(private supabase: SupabaseClient) { }

    async getProfile(email: string, userId: string): Promise<Profile> {
        const { data, error } = await this.supabase
            .from("profiles")
            .select("name, start_date, end_date, menu")
            .eq("user_id", userId)
            .single()

        if (error) throw new Error(error.message)
        return {
            userId: userId,
            email: email,
            ...data
        }
    }
    async updateProfile(dto: ProfileDto, userId: string): Promise<void> {
        const { error } = await this.supabase
            .from("profiles")
            .update(dto)
            .eq("user_id", userId);

        if (error) throw new Error(error.message)
    }
}