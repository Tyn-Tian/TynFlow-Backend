import { Variables } from './../config/env';
import { Hono } from "hono";
import { Bindings } from "../config/env";
import { BudgetRepository } from '../repositories/budget.repository';
import { BudgetService } from '../services/budget.service';
import { requireAuth } from '../middlewares/auth.middleware';
import { TransactionRepository } from '../repositories/transaction.repository';
import { AuthRepository } from '../repositories/auth.repository';

const budgetRoute = new Hono<{ Bindings: Bindings, Variables: Variables }>();

function getBudgetService(c: any) {
    const repo = new BudgetRepository(c.get("supabase"));
    const authRepo = new AuthRepository(c.get("supabase"));
    const transactionRepo = new TransactionRepository(c.get("supabase"));
    return new BudgetService(repo, authRepo, transactionRepo);
}

budgetRoute.get("/", requireAuth, async (c) => {
    const userId = c.get("userId");
    const email = c.get("email");
    if (!userId || !email) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const service = getBudgetService(c);
    const budgets = await service.getAll(email, userId);

    return c.json({
        success: true,
        data: budgets,
        message: "Budgets fetched successfully"
    }, 200)
})

budgetRoute.post("/", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const body = await c.req.json();
    const service = getBudgetService(c);
    await service.create(body, userId);

    return c.json({
        success: true,
        message: "Budget created successfully"
    }, 201);
})

budgetRoute.get("/options", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const query = c.req.query("includeDeleted") === "true";

    const service = getBudgetService(c);
    const budgets = await service.getOptions(userId, query);

    return c.json({
        success: true,
        data: budgets,
        message: "Budget options fetched successfully"
    }, 200)
})

budgetRoute.put("/:id", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const body = await c.req.json();

    const id = c.req.param("id");
    if (!id) return c.json({
        success: false,
        message: "Budget ID is required"
    }, 400);

    const service = getBudgetService(c);
    await service.update(id, body, userId);

    return c.json({
        success: true,
        message: "Budget updated successfully"
    }, 200);
})

budgetRoute.delete("/:id", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const id = c.req.param("id");
    if (!id) return c.json({
        success: false,
        message: "Budget ID is required"
    }, 400);

    const service = getBudgetService(c);
    await service.delete(id, userId);

    return c.json({
        success: true,
        message: "Budget deleted successfully"
    }, 200);
})

export default budgetRoute;