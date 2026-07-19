import { Wishlist, WishlistDto } from "./wishlist.type";

export interface IWishlistRepository {
    getAll(): Promise<{ wishlists: Wishlist[], count: number }>;
    create(dto: WishlistDto, userId: string): Promise<void>;
    update(id: string, dto: WishlistDto, userId: string): Promise<void>;
    change(id: string, status: string, userId: string): Promise<void>;
    delete(id: string, userId: string): Promise<void>;
}