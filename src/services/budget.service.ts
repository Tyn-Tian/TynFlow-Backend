import { IBudgetRepository } from "../domain/budget/budget.repository.interface";
import { Budget, BudgetDto } from "../domain/budget/budget.type";

export class BudgetService {
    constructor(private budgetRepo: IBudgetRepository) { }

    async getAll(userId: string, includeDeleted?: boolean): Promise<Budget[]> {
        return this.budgetRepo.getAll(userId, includeDeleted);
    }

    async getById(id: string, userId: string): Promise<Budget | null> {
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
}
