import { IAuthRepository } from "../domain/auth/auth.repository.interface";
import { IBudgetRepository } from "../domain/budget/budget.repository.interface";
import { Budget, BudgetDto, Option } from "../domain/budget/budget.type";
import { ITransactionRepository } from "../domain/transaction/transaction.repository.interface";

export class BudgetService {
    constructor(
        private budgetRepo: IBudgetRepository,
        private authRepo: IAuthRepository,
        private transactionRepo: ITransactionRepository
    ) { }

    async getAll(email: string, userId: string): Promise<Budget[]> {
        const budgets = await this.budgetRepo.getAll(userId);
        const profile = await this.authRepo.getProfile(email, userId);

        if (!profile) throw new Error("Profile not found");

        const today = new Date().toISOString().split("T")[0];
        const dailyEnd = (profile.end_date && profile.end_date < today) ? profile.end_date : today;

        const start = new Date(profile.start_date || today);
        const end = new Date(dailyEnd);
        const days = Math.max(
            1,
            Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1,
        );

        const enrichedBudgets = await Promise.all(
            (budgets || []).map(async (b) => {
                const dailyTransactions = await this.transactionRepo.findTransactions({
                    budgetId: b.id,
                    type: "Expense",
                    startDate: profile.start_date || today,
                    endDate: dailyEnd
                }, userId);

                const realizationTransactions = await this.transactionRepo.findTransactions({
                    budgetId: b.id,
                    type: "Expense",
                    startDate: profile.start_date || today,
                    endDate: profile.end_date || today
                }, userId);

                const dailySum = (dailyTransactions || []).reduce(
                    (sum, tx) => sum + (Number(tx.amount) || 0),
                    0,
                );

                const realizationSum = (realizationTransactions || []).reduce(
                    (sum, tx) => sum + (Number(tx.amount) || 0),
                    0,
                );

                return {
                    ...b,
                    daily_spending: dailySum / days,
                    total_spending: realizationSum
                };
            })
        );

        return enrichedBudgets;
    }

    async getOptions(userId: string, includeDeleted?: boolean): Promise<Option[]> {
        return this.budgetRepo.getOptions(userId, includeDeleted);
    }

    async getById(id: string, userId: string): Promise<Omit<Budget, "daily_spending" | "total_spending"> | null> {
        return this.budgetRepo.getById(id, userId);
    }

    async create(dto: BudgetDto, userId: string): Promise<void> {
        return this.budgetRepo.create(dto, userId);
    }

    async update(id: string, dto: BudgetDto, userId: string): Promise<void> {
        return this.budgetRepo.update(id, dto, userId);
    }

    async delete(id: string, userId: string): Promise<void> {
        return this.budgetRepo.delete(id, userId);
    }

    async updateLeftover(id: string, delta: number, userId: string): Promise<void> {
        const budget = await this.budgetRepo.getById(id, userId);
        if (!budget) throw new Error("Budget not found");

        const currentLeftover = Number(budget.leftover);
        const newLeftover = currentLeftover + delta;

        await this.budgetRepo.update(id, {
            name: budget.name,
            total: budget.total,
            leftover: newLeftover
        }, userId);
    }
}
