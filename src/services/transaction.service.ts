import { WalletService } from './wallet.service';
import { ITransactionRepository } from "../domain/transaction/transaction.repository.interface";
import { Filters, Params, Transaction, TransactionDto } from "../domain/transaction/transaction.type";
import { BudgetService } from "./budget.service";
import { PortfolioService } from './portfolio.service';
import { Wallet } from '../domain/wallet/wallet.type';
import { Budget } from '../domain/budget/budget.type';
import { Portfolio } from '../domain/portfolio/portfolio.type';

export class TransactionService {
    constructor(
        private transactionRepo: ITransactionRepository,
        private budgetService: BudgetService,
        private walletService: WalletService,
        private portfolioService: PortfolioService
    ) {}

    async getAll(params: Params, userId: string): Promise<{ transactions: Transaction[], count: number }> {
        return await this.transactionRepo.getAll(params, userId)
    }
    async findTransactions(filters: Filters, userId: string): Promise<Transaction[]> {
        return await this.transactionRepo.findTransactions(filters, userId)
    }
    async getById(id: string, userId: string): Promise<Transaction> {
        return await this.transactionRepo.getById(id, userId)
    }
    async create(dto: TransactionDto, userId: string) {
        await this.transactionRepo.create(dto, userId)

        if (dto.type === "Expense" && dto.wallet_id && dto.budget_id) {
            await this.budgetService.updateLeftover(dto.budget_id, -Number(dto.amount), userId);
            await this.walletService.updateBalance(dto.wallet_id, -Number(dto.amount), userId);
        }

        if (dto.type === "Income" && dto.wallet_id) {
            await this.walletService.updateBalance(dto.wallet_id, Number(dto.amount), userId);
        }

        if (dto.type === "Transfer" && dto.wallet_id && dto.transfer_id) {
            await this.walletService.updateBalance(
                dto.wallet_id,
                -(Number(dto.amount) + Number(dto.admin_fee ?? 0)),
                userId
            );
            await this.walletService.updateBalance(dto.transfer_id, Number(dto.amount), userId);
        }

        if (dto.type === "Invest" && dto.wallet_id && dto.portfolio_id) {
            await this.walletService.updateBalance(
                dto.wallet_id,
                -(Number(dto.amount) + Number(dto.admin_fee ?? 0)),
                userId
            );
            await this.portfolioService.updateValue(dto.portfolio_id, Number(dto.amount), userId);
        }
    }
    async createMany(dtos: TransactionDto[], userId: string): Promise<void> {
        for (const dto of dtos) {
            await this.create(dto, userId);
        }
    }
    async edit(id: string, dto: TransactionDto, userId: string): Promise<void> {
        const tx = await this.getById(id, userId);
        if (!tx) throw new Error("Transaction not found")

        if (tx.type === "Expense" && tx.wallet_id && tx.budget_id) {
            await this.budgetService.updateLeftover(tx.budget_id, Number(tx.amount), userId);
            await this.walletService.updateBalance(tx.wallet_id, Number(tx.amount), userId);
        }

        if (tx.type === "Income" && tx.wallet_id) {
            await this.walletService.updateBalance(tx.wallet_id, -Number(tx.amount), userId);
        }

        if (tx.type === "Transfer" && tx.wallet_id && tx.transfer_id) {
            await this.walletService.updateBalance(
                tx.wallet_id,
                Number(tx.amount) + Number(tx.admin_fee ?? 0),
                userId
            );
            await this.walletService.updateBalance(tx.transfer_id, -Number(tx.amount), userId);
        }

        if (tx.type === "Invest" && tx.wallet_id && tx.portfolio_id) {
            await this.walletService.updateBalance(
                tx.wallet_id,
                Number(tx.amount) + Number(tx.admin_fee ?? 0),
                userId
            );
            await this.portfolioService.updateValue(tx.portfolio_id, -Number(tx.amount), userId);
        }

        await this.transactionRepo.update(id, dto, userId);

        if (dto.type === "Expense" && dto.wallet_id && dto.budget_id) {
            await this.budgetService.updateLeftover(dto.budget_id, -Number(dto.amount), userId);
            await this.walletService.updateBalance(dto.wallet_id, -Number(dto.amount), userId);
        }

        if (dto.type === "Income" && dto.wallet_id) {
            await this.walletService.updateBalance(dto.wallet_id, Number(dto.amount), userId);
        }

        if (dto.type === "Transfer" && dto.wallet_id && dto.transfer_id) {
            await this.walletService.updateBalance(
                dto.wallet_id,
                -(Number(dto.amount) + Number(dto.admin_fee ?? 0)),
                userId
            );
            await this.walletService.updateBalance(dto.transfer_id, Number(dto.amount), userId);
        }

        if (dto.type === "Invest" && dto.wallet_id && dto.portfolio_id) {
            await this.walletService.updateBalance(
                dto.wallet_id,
                -(Number(dto.amount) + Number(dto.admin_fee ?? 0)),
                userId
            );
            await this.portfolioService.updateValue(dto.portfolio_id, Number(dto.amount), userId);
        }
    }
    async delete(id: string, userId: string): Promise<void> {
        const tx = await this.getById(id, userId);
        if (!tx) throw new Error("Transaction not found")

        if (tx.type === "Expense" && tx.wallet_id && tx.budget_id) {
            await this.budgetService.updateLeftover(tx.budget_id, Number(tx.amount), userId);
            await this.walletService.updateBalance(tx.wallet_id, Number(tx.amount), userId);
        }

        if (tx.type === "Income" && tx.wallet_id) {
            await this.walletService.updateBalance(tx.wallet_id, -Number(tx.amount), userId);
        }

        if (tx.type === "Transfer" && tx.wallet_id && tx.transfer_id) {
            await this.walletService.updateBalance(
                tx.wallet_id,
                Number(tx.amount) + Number(tx.admin_fee ?? 0),
                userId
            );
            await this.walletService.updateBalance(tx.transfer_id, -Number(tx.amount), userId);
        }

        if (tx.type === "Invest" && tx.wallet_id && tx.portfolio_id) {
            await this.walletService.updateBalance(
                tx.wallet_id,
                Number(tx.amount) + Number(tx.admin_fee ?? 0),
                userId
            );
            await this.portfolioService.updateValue(tx.portfolio_id, -Number(tx.amount), userId);
        }

        await this.transactionRepo.delete(id, userId);
    }
    async exportExcel({
        wallets,
        budgets,
        portfolios,
        filters,
        userId
    }: {
        wallets: Wallet[],
        budgets: Budget[],
        portfolios: Portfolio[],
        filters: Filters,
        userId: string
    }) {
        const data = await this.transactionRepo.findTransactions(filters, userId);

        const walletIds = Array.from(
            new Set(
                data.flatMap(
                    (r) => [r.wallet_id, r.transfer_id].filter(Boolean) as string[],
                ),
            ),
        );
        let walletMap: Record<string, string> = {};
        if (walletIds.length) {
            if (wallets)
                walletMap = Object.fromEntries(
                    wallets.map((w) => [w.id, w.name ?? ""]),
                );
        }

        const budgetIds = Array.from(
            new Set(data.map((r) => r.budget_id).filter(Boolean) as string[]),
        );
        let budgetMap: Record<string, string> = {};
        if (budgetIds.length) {
            if (budgets)
                budgetMap = Object.fromEntries(
                    budgets.map((b) => [b.id, b.name ?? ""]),
                );
        }

        const portfolioIds = Array.from(
            new Set(data.map((r) => r.portfolio_id).filter(Boolean) as string[]),
        );
        let portfolioMap: Record<string, string> = {};
        if (portfolioIds.length) {
            if (portfolios)
                portfolioMap = Object.fromEntries(
                    portfolios.map((p) => [p.id, p.name ?? ""]),
                );
        }

        return data.map((t) => ({
            ...t,
            budgetName: t.budget_id ? budgetMap[t.budget_id] : undefined,
            walletName: t.wallet_id ? walletMap[t.wallet_id] : undefined,
            transferName: t.transfer_id ? walletMap[t.transfer_id] : undefined,
            portfolioName: t.portfolio_id ? portfolioMap[t.portfolio_id] : undefined,
        }));
    }
}