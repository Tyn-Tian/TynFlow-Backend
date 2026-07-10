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
        const data = await this.walletRepo.getById(id, userId);
        const newBalance = Number(data?.balance || 0) + Number(delta);

        this.walletRepo.update(
            id,
            {
                name: data?.name ?? "",
                type: data?.type ?? "",
                balance: newBalance
            },
            userId
        )
    }
}