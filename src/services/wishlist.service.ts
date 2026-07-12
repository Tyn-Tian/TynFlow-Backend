import { IWishlistRepository } from "../domain/wishlist/wishlist.repository.interface";
import { Params, WishlistDto } from "../domain/wishlist/wishlist.type";

export class WishlistService {
    constructor(private wishlistRepo: IWishlistRepository) {}

    async getAll(params: Params, userId: string) {
        return this.wishlistRepo.getAll(params, userId);
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