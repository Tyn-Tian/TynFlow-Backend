import { IWishlistRepository } from "../domain/wishlist/wishlist.repository.interface";
import { KanbanResponse, WishlistDto } from "../domain/wishlist/wishlist.type";

export class WishlistService {
    constructor(private wishlistRepo: IWishlistRepository) {}

    async getAll(userId: string): Promise<KanbanResponse> {
        const { wishlists } = await this.wishlistRepo.getAll();

        const response: KanbanResponse = {
            active: [],
            achieved: [],
            cancelled: []
        };

        for (const item of wishlists) {
            const mappedItem = {
                id: item.id,
                name: item.name,
                priority: item.priority.toLowerCase(),
                price: item.price,
                assignee: item.profiles?.name || "Unknown",
                created_at: item.created_at,
                is_disabled: item.user_id !== userId
            };

            if (item.status === "Active") response.active.push(mappedItem);
            else if (item.status === "Achieved") response.achieved.push(mappedItem);
            else if (item.status === "Cancelled") response.cancelled.push(mappedItem);
        }

        return response;
    }

    async change(id: string, status: string, userId: string): Promise<void> {
        return this.wishlistRepo.change(id, status, userId);
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