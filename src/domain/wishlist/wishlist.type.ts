export interface Wishlist {
    id: string;
    user_id: string;
    created_at: string;
    name: string;
    priority: "Low" | "Medium" | "High";
    status: "Active" | "Achieved" | "Cancelled";
    price: number;
    profiles?: { name: string };
}

export interface KanbanItem {
    id: string;
    name: string;
    priority: string;
    price: number;
    assignee: string;
    created_at: string;
    is_disabled: boolean;
}

export interface KanbanResponse {
    active: KanbanItem[];
    achieved: KanbanItem[];
    cancelled: KanbanItem[];
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
