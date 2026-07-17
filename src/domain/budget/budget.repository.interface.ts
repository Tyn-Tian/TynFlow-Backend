import { Budget, BudgetDto, Option } from "./budget.type";

export interface IBudgetRepository {
    getAll(userId: string): Promise<Omit<Budget, "daily_spending" | "total_spending">[]>;
    getOptions(userId: string, includeDeleted?: boolean): Promise<Option[]>;
    getById(id: string, userId: string): Promise<Omit<Budget, "daily_spending" | "total_spending"> | null>;
    create(dto: BudgetDto, userId: string): Promise<void>;
    update(id: string, dto: BudgetDto, userId: string): Promise<void>;
    delete(id: string, userId: string): Promise<void>;
}