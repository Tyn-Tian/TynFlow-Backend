import { Hono } from "hono";
import { Bindings, Variables } from "../config/env";
import { WishlistRepository } from "../repositories/wishlist.repository";
import { WishlistService } from "../services/wishlist.service";
import { requireAuth } from "../middlewares/auth.middleware";
import { createClient } from "@supabase/supabase-js";

const wishlistRoute = new Hono<{ Bindings: Bindings, Variables: Variables }>();

function getWishlistService(c: any) {
    const repo = new WishlistRepository(c.get("supabase"));
    return new WishlistService(repo);
}

wishlistRoute.get("/", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const adminSupabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
    const repo = new WishlistRepository(adminSupabase);
    const service = new WishlistService(repo);

    const items = await service.getAll(userId);

    return c.json({
        success: true,
        data: items,
        message: "Wishlists fetched successfully"
    }, 200)
})

wishlistRoute.post("/", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401)

    const body = await c.req.json();
    const service = getWishlistService(c);
    await service.create(body, userId);

    return c.json({
        success: true,
        message: "Wishlist created successfully"
    }, 201)
})

wishlistRoute.put("/:id", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401)

    const body = await c.req.json();

    const id = c.req.param("id");
    if (!id) return c.json({
        success: false,
        message: "Wishlist ID is required"
    }, 400)

    const service = getWishlistService(c);
    await service.update(id, body, userId);

    return c.json({
        success: true,
        message: "Wishlist updated successfully"
    }, 200)
})

wishlistRoute.patch("/:id", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401)

    const body = await c.req.json();

    const id = c.req.param("id");
    if (!id) return c.json({
        success: false,
        message: "Wishlist ID is required"
    }, 400)

    const service = getWishlistService(c);
    await service.change(id, body.status, userId);

    return c.json({
        success: true,
        message: "Wishlist status changed successfully"
    }, 200)
})

wishlistRoute.delete("/:id", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401)

    const id = c.req.param("id");
    if (!id) return c.json({
        success: false,
        message: "Wishlist ID is required"
    }, 400)

    const service = getWishlistService(c);
    await service.delete(id, userId);

    return c.json({
        success: true,
        message: "Wishlist deleted successfully"
    }, 200)
})

export default wishlistRoute;