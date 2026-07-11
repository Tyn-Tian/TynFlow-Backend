import { Filters, Transaction, TransactionDto } from "./transaction.type";

export interface ITransactionRepository {
    findTransactions(filters: Filters, userId: string): Promise<Transaction[]>
    findTransactionDates(filters: { walletId?: string, budgetId?: string }, userId: string): Promise<{ date: string }[]>
    findEarliestTransaction(userId: string): Promise<{ date: string }>
    getById(id: string, userId: string): Promise<Transaction>
    create(dto: TransactionDto, userId: string): Promise<void>
    update(id: string, dto: TransactionDto, userId: string): Promise<void>
    delete(id: string, userId: string): Promise<void>
}