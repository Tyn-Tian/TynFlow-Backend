import { Portfolio, PortfolioDto, PortfolioSnapshot } from "./portfolio.type";

export interface IPortfolioRepository {
    getAll(userId: string): Promise<Portfolio[]>
    getById(id: string, userId: string): Promise<Portfolio>
    create(dto: PortfolioDto, userId: string): Promise<void>
    update(id: string, dto: PortfolioDto, userId: string): Promise<void>
    delete(id: string, userId: string): Promise<void>
    getSnapshot(userId: string): Promise<PortfolioSnapshot[]>
}