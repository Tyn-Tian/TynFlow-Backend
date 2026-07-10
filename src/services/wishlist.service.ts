import { IWishlistRepository } from "../domain/wishlist/wishlist.repository.interface";
import { WishlistDto } from "../domain/wishlist/wishlist.type";

export class WishlistService {
    constructor(private wishlistRepo: IWishlistRepository) {}

    async getAll(page: number = 1, limit: number = 10, userId: string) {
        return this.wishlistRepo.getAll(page, limit, userId);
    }

    async create(dto: WishlistDto, userId: string): Promise<void> {
        return this.wishlistRepo.create(dto, userId);
    }

    async update(id: string, dto: WishlistDto, userId: string): Promise<void> {
        return this.wishlistRepo.update(id, dto, userId);
    }

    async delete(id: string, userId: string): Promise<void> {
        return this.wishlistRepo.delete(id, userId);
    }
}