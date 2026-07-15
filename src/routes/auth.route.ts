import { Variables } from './../config/env';
import { Hono } from "hono";
import { Bindings } from "../config/env";
import { AuthRepository } from '../repositories/auth.repository';
import { AuthService } from '../services/auth.service';
import { requireAuth } from '../middlewares/auth.middleware';

const authRoute = new Hono<{ Bindings: Bindings, Variables: Variables }>();

function getAuthService(c: any) {
    const repo = new AuthRepository(c.get("supabase"));
    return new AuthService(repo);
}

authRoute.get("/profile", requireAuth, async (c) => {
    const userId = c.get("userId");
    const email = c.get("email");
    if (!userId || !email) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const service = getAuthService(c);
    const profile = await service.getProfile(email, userId);

    return c.json({
        success: true,
        data: profile,
        message: "Profile fetched successfully"
    }, 200)
})

authRoute.put("/profile", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const body = await c.req.json();
    const service = getAuthService(c);
    await service.updateProfile(body, userId);

    return c.json({
        success: true,
        message: "Profile updated successfully"
    }, 200)
})

export default authRoute;