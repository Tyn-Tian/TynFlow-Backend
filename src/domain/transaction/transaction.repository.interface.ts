import { Filters, Params, Transaction, TransactionDto } from "./transaction.type";

export interface ITransactionRepository {
    getAll(params: Params, userId: string): Promise<{ transactions: Transaction[], count: number }>
    findTransactions(filters: Filters, userId: string): Promise<Transaction[]>
    getById(id: string, userId: string): Promise<Transaction>
    create(dto: TransactionDto, userId: string): Promise<void>
    update(id: string, dto: TransactionDto, userId: string): Promise<void>
    delete(id: string, userId: string): Promise<void>
}