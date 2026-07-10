import { Budget, BudgetDto } from "./budget.type";

export interface IBudgetRepository {
    getAll(userId: string, includeDeleted?: boolean): Promise<Budget[]>;
    getById(id: string, userId: string): Promise<Budget | null>;
    create(dto: BudgetDto, userId: string): Promise<void>;
    update(id: string, dto: BudgetDto, userId: string): Promise<void>;
    delete(id: string, userId: string): Promise<void>;
}