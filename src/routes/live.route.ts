import { Variables } from './../config/env';
import { Hono } from "hono";
import { Bindings } from "../config/env";
import { requireAuth } from '../middlewares/auth.middleware';
import { LiveRepository } from '../repositories/live.repository';
import { LiveService } from '../services/live.service';

const liveRoute = new Hono<{ Bindings: Bindings, Variables: Variables }>();

function getLiveService(c: any) {
    const repo = new LiveRepository(c.get("supabase"));
    return new LiveService(repo);
}

liveRoute.get("/", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const service = getLiveService(c);
    const lives = await service.getAll(userId);

    return c.json({
        success: true,
        data: lives,
        message: "Budget fetched successfully"
    }, 200)
})

liveRoute.post("/", requireAuth, async (c) =>{
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const body = await c.req.json();
    const service = getLiveService(c);
    await service.create(body, userId);

    return c.json({
        success: true,
        message: "Live created successfully"
    }, 201);
})

liveRoute.put("/:id", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const id = c.req.param("id");
    if (!id) return c.json({
        success: false,
        message: "Live ID is required"
    }, 400);

    const body = await c.req.json();
    const service = getLiveService(c);
    await service.update(id, body, userId);

    return c.json({
        success: true,
        message: "Live updated successfully"
    }, 200);
})

liveRoute.delete("/:id", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const id = c.req.param("id");
    if (!id) return c.json({
        success: false,
        message: "Live ID is required"
    }, 400);

    const service = getLiveService(c);
    await service.delete(id, userId);

    return c.json({
        success: true,
        message: "Live deleted successfully"
    }, 200);
})

export default liveRoute;