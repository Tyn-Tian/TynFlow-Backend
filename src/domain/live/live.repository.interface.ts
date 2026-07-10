import { Live, LiveDto } from "./live.type";

export interface ILiveRepository {
    getAll(userId: string): Promise<Live[]>
    getById(id: string, userId: string): Promise<Live>
    create(dto: LiveDto, userId: string): Promise<void>
    update(id: string, dto: LiveDto, userId: string): Promise<void>
    delete(id: string, userId: string): Promise<void>
}