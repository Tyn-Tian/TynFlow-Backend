import { IPortfolioRepository } from "../domain/portfolio/portfolio.repository.interface";
import { Portfolio, PortfolioDto, PortfolioSnapshot } from "../domain/portfolio/portfolio.type";

export class PortfolioService {
    constructor(private portfolioRepo: IPortfolioRepository) { }

    async getAll(userId: string): Promise<Portfolio[]> {
        return await this.portfolioRepo.getAll(userId);
    }
    async getById(id: string, userId: string): Promise<Portfolio> {
        return await this.portfolioRepo.getById(id, userId);
    }
    async create(dto: PortfolioDto, userId: string): Promise<void> {
        await this.portfolioRepo.create(dto, userId);
    }
    async update(id: string, dto: PortfolioDto, userId: string): Promise<void> {
        await this.portfolioRepo.update(id, dto, userId);
    }
    async delete(id: string, userId: string): Promise<void> {
        await this.portfolioRepo.delete(id, userId);
    }
    async getSnapshot(userId: string): Promise<PortfolioSnapshot[]> {
        return await this.portfolioRepo.getSnapshot(userId);
    }
}