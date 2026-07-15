import { Profile, ProfileDto } from "./auth.type";

export interface IAuthRepository {
    getProfile(email: string, userId: string): Promise<Profile>
    updateProfile(dto: ProfileDto, userId: string): Promise<void>
}