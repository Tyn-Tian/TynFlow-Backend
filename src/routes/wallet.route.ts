import { Variables } from './../config/env';
import { Hono } from "hono";
import { Bindings } from "../config/env";
import { WalletRepository } from '../repositories/wallet.repository';
import { WalletService } from '../services/wallet.service';
import { requireAuth } from '../middlewares/auth.middleware';

const walletRoute = new Hono<{ Bindings: Bindings, Variables: Variables }>();

function getWalletService(c: any) {
    const repo = new WalletRepository(c.get("supabase"));
    return new WalletService(repo);
}

walletRoute.get("/", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const service = getWalletService(c);
    const wallets = await service.getAll(userId);

    return c.json({
        success: true,
        data: wallets,
        message: "Wallets fetched successfully"
    }, 200)
})

walletRoute.post("/", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401)

    const body = await c.req.json();
    const service = getWalletService(c);
    await service.create(body, userId);

    return c.json({
        success: true,
        message: "Wallet created successfully"
    }, 201)
})

walletRoute.put("/:id", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401)

    const body = await c.req.json();

    const id = c.req.param("id");
    if (!id) return c.json({
        success: false,
        message: "Wallet ID is required"
    }, 400);

    const service = getWalletService(c);
    await service.update(id, body, userId);

    return c.json({
        success: true,
        message: "Wallet updated successfully"
    }, 200)
})

walletRoute.delete("/:id", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401)

    const id = c.req.param("id");
    if (!id) return c.json({
        success: false,
        message: "Wallet ID is required"
    }, 400)

    const service = getWalletService(c);
    await service.delete(id, userId);

    return c.json({
        success: true,
        message: "Wallet deleted successfully"
    }, 200)
})

export default walletRoute;