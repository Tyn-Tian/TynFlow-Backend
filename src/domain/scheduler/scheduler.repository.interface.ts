import { Scheduler, SchedulerDto } from "./scheduler.type";

export interface ISchedulerRepository {
    getAll(userId: string): Promise<Scheduler[]>
    create(dto: SchedulerDto, userId: string): Promise<void>
    update(id: string, dto: SchedulerDto, userId: string): Promise<void>
    deactive(id: string, userId: string): Promise<void>
    activate(id: string, userId: string): Promise<void>
    delete(id: string, userId: string): Promise<void>
}