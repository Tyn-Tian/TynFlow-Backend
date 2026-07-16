import { WalletService } from './wallet.service';
import { ITransactionRepository } from "../domain/transaction/transaction.repository.interface";
import { Filters, Params, Transaction, TransactionDto } from "../domain/transaction/transaction.type";
import { BudgetService } from "./budget.service";
import { PortfolioService } from './portfolio.service';

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
    async exportExcel(month: string, year: string, userId: string) {
        const { transactions } = await this.transactionRepo.getAll({
            month,
            year,
            page: 1,
            limit: 1000000
        }, userId);

        return transactions;
    }
}