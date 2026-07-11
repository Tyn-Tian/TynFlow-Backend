import { IWalletRepository } from "../domain/wallet/wallet.repository.interface";
import { Wallet, WalletDto } from "../domain/wallet/wallet.type";

export class WalletService {
    constructor(private walletRepo: IWalletRepository) { }

    async getAll(userId: string): Promise<Wallet[]> {
        return this.walletRepo.getAll(userId);
    }

    async create(dto: WalletDto, userId: string): Promise<void> {
        return this.walletRepo.create(dto, userId);
    }

    async update(id: string, dto: WalletDto, userId: string): Promise<void> {
        return this.walletRepo.update(id, dto, userId);
    }

    async delete(id: string, userId: string): Promise<void> {
        return this.walletRepo.delete(id, userId);
    }

    async updateBalance(id: string, delta: number, userId: string): Promise<void> {
        const wallet = await this.walletRepo.getById(id, userId);
        if (!wallet) throw new Error("Wallet not found");

        const newBalance = Number(wallet.balance) + Number(delta);

        await this.walletRepo.update(
            id,
            {
                name: wallet.name,
                type: wallet.type,
                balance: newBalance
            },
            userId
        );
    }
}