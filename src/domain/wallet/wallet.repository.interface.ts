import { Wallet, WalletDto } from "./wallet.type";

export interface IWalletRepository {
    getAll(userId: string): Promise<Wallet[]>;
    getById(id: string, userId: string): Promise<Wallet | null>;
    create(dto: WalletDto, userId: string): Promise<void>;
    update(id: string, dto: WalletDto, userId: string): Promise<void>;
    delete(id: string, userId: string): Promise<void>;
}