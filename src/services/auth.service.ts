import { IAuthRepository } from "../domain/auth/auth.repository.interface";
import { Profile, ProfileDto } from "../domain/auth/auth.type";

export class AuthService {
    constructor(private authRepo: IAuthRepository) { }

    async getProfile(email: string, userId: string): Promise<Profile> {
        return this.authRepo.getProfile(email, userId);
    }
    async updateProfile(dto: ProfileDto, userId: string): Promise<void> {
        return this.authRepo.updateProfile(dto, userId);
    }
}