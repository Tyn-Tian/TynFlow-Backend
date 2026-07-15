import { Hono } from "hono";
import { Bindings, Variables } from "../config/env";
import { TransactionRepository } from "../repositories/transaction.repository";
import { TransactionService } from "../services/transaction.service";
import { WalletRepository } from "../repositories/wallet.repository";
import { WalletService } from "../services/wallet.service";
import { BudgetRepository } from "../repositories/budget.repository";
import { BudgetService } from "../services/budget.service";
import { PortfolioRepository } from "../repositories/portfolio.repository";
import { PortfolioService } from "../services/portfolio.service";
import { requireAuth } from "../middlewares/auth.middleware";

const transactionRoute = new Hono<{ Bindings: Bindings, Variables: Variables }>();

function getTransactionService(c: any) {
    const transactionRepo = new TransactionRepository(c.get("supabase"));

    const walletRepo = new WalletRepository(c.get("supabase"));
    const walletService = new WalletService(walletRepo);

    const budgetRepo = new BudgetRepository(c.get("supabase"));
    const budgetService = new BudgetService(budgetRepo);

    const portfolioRepo = new PortfolioRepository(c.get("supabase"));
    const portfolioService = new PortfolioService(portfolioRepo);

    return new TransactionService(transactionRepo, budgetService, walletService, portfolioService);
}

transactionRoute.get("/", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401)

    const page = parseInt(c.req.query("page") ?? "1");
    const limit = parseInt(c.req.query("limit") ?? "10");
    const walletId = c.req.query("walletId") as string;
    const budgetId = c.req.query("budgetId") as string;

    const service = getTransactionService(c)
    const { transactions, count } = await service.getAll({
        page,
        limit,
        walletId,
        budgetId
    }, userId);

    return c.json({
        success: true,
        data: {
            transactions,
            count
        }
    })
})

transactionRoute.post("/", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const service = getTransactionService(c);
    const dto = await c.req.json();

    await service.create(dto, userId);

    return c.json({
        success: true,
        message: "Transaction created successfully"
    }, 201);
})

transactionRoute.post("/bulk", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const service = getTransactionService(c);
    const dto = await c.req.json();

    await service.createMany(dto, userId);

    return c.json({
        success: true,
        message: "Transactions created successfully"
    }, 201);
})

transactionRoute.get("/:id", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const service = getTransactionService(c);
    const id = c.req.param("id");
    if (!id) return c.json({
        success: false,
        message: "Transaction ID is required"
    }, 400);

    const transaction = await service.getById(id, userId);

    return c.json({
        success: true,
        data: transaction,
        message: "Transaction fetched successfully"
    }, 200);
})

transactionRoute.put("/:id", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const service = getTransactionService(c);
    const id = c.req.param("id");
    if (!id) return c.json({
        success: false,
        message: "Transaction ID is required"
    }, 400);

    const dto = await c.req.json();
    await service.edit(id, dto, userId);

    return c.json({
        success: true,
        message: "Transaction updated successfully"
    }, 200);
})

transactionRoute.delete("/:id", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const service = getTransactionService(c);
    const id = c.req.param("id");
    if (!id) return c.json({
        success: false,
        message: "Transaction ID is required"
    }, 400);

    await service.delete(id, userId);

    return c.json({
        success: true,
        message: "Transaction deleted successfully"
    }, 200);
})

export default transactionRoute;