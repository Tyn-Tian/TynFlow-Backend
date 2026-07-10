import { ILiveRepository } from "../domain/live/live.repository.interface";
import { Live, LiveDto } from "../domain/live/live.type";

function toIsoDate(dateStr: string) {
    const parts = dateStr.split("/");
    if (parts.length === 3) {
        const [dd, mm, yyyy] = parts;
        return `${yyyy}-${mm}-${dd}`;
    }
    return dateStr;
}

export class LiveService {
    constructor(private repo: ILiveRepository) { }

    async getAll(userId: string): Promise<Live[]> {
        return this.repo.getAll(userId);
    }

    async getById(id: string, userId: string): Promise<Live> {
        return this.repo.getById(id, userId);
    }

    async create(dto: LiveDto, userId: string): Promise<void> {
        return this.repo.create({
            ...dto,
            date: toIsoDate(dto.date)
        }, userId);
    }

    async update(id: string, dto: LiveDto, userId: string): Promise<void> {
        return this.repo.update(id, {
            ...dto,
            date: toIsoDate(dto.date),
        }, userId);
    }

    async delete(id: string, userId: string): Promise<void> {
        return this.repo.delete(id, userId);
    }
}