import { SchedulerDto } from "../domain/scheduler/scheduler.type";
import { ISchedulerRepository } from "../domain/scheduler/scheduler.repository.interface";

export class SchedulerService {
    constructor(private schedulerRepo: ISchedulerRepository) { }

    async getAll(userId: string) {
        return await this.schedulerRepo.getAll(userId);
    }
    async create(dto: SchedulerDto, userId: string) {
        return await this.schedulerRepo.create(dto, userId);
    }
    async update(id: string, dto: SchedulerDto, userId: string) {
        return await this.schedulerRepo.update(id, dto, userId);
    }
    async deactive(id: string, userId: string) {
        return await this.schedulerRepo.deactive(id, userId);
    }
    async activate(id: string, userId: string) {
        return await this.schedulerRepo.activate(id, userId);
    }
    async delete(id: string, userId: string) {
        return await this.schedulerRepo.delete(id, userId);
    }
}