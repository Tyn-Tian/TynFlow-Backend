export interface Wishlist {
    id: string;
    user_id: string;
    created_at: string;
    name: string;
    priority: "Low" | "Medium" | "High";
    status: "Active" | "Achieved" | "Cancelled";
    price: number;
}

export interface Params {
    page: number;
    limit: number;
    search?: string;
    priority?: "Low" | "Medium" | "High";
    status?: "Active" | "Achieved" | "Cancelled";
}

export type WishlistDto = {
    name: string;
    priority: "Low" | "Medium" | "High";
    status: "Active" | "Achieved" | "Cancelled";
    price: number;
};
