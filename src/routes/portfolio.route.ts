import { Variables } from './../config/env';
import { Hono } from "hono";
import { Bindings } from "../config/env";
import { requireAuth } from '../middlewares/auth.middleware';
import { PortfolioRepository } from '../repositories/portfolio.repository';
import { PortfolioService } from '../services/portfolio.service';

const portfolioRoute = new Hono<{ Bindings: Bindings, Variables: Variables }>();

function getPortfolioService(c: any) {
    const repo = new PortfolioRepository(c.get("supabase"));
    return new PortfolioService(repo);
}

portfolioRoute.get("/", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const service = getPortfolioService(c);
    const portfolios = await service.getAll(userId);

    return c.json({
        success: true,
        data: portfolios,
        message: "Portfolios fetched successfully"
    }, 200);
});

portfolioRoute.post("/", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const body = await c.req.json();
    const service = getPortfolioService(c);
    await service.create(body, userId);

    return c.json({
        success: true,
        message: "Portfolio created successfully"
    }, 201);
});

portfolioRoute.get("/snapshots", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const service = getPortfolioService(c);
    const snapshots = await service.getSnapshot(userId);

    return c.json({
        success: true,
        data: snapshots,
        message: "Portfolio snapshots fetched successfully"
    }, 200);
});

portfolioRoute.put("/:id", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const id = c.req.param("id");
    if (!id) return c.json({
        success: false,
        message: "Portfolio ID is required"
    }, 400);

    const body = await c.req.json();
    const service = getPortfolioService(c);
    await service.update(id, body, userId);

    return c.json({
        success: true,
        message: "Portfolio updated successfully"
    }, 200);
})

portfolioRoute.delete("/:id", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const id = c.req.param("id");
    if (!id) return c.json({
        success: false,
        message: "Portfolio ID is required"
    }, 400);

    const service = getPortfolioService(c);
    await service.delete(id, userId);

    return c.json({
        success: true,
        message: "Portfolio deleted successfully"
    }, 200);
});

export default portfolioRoute;