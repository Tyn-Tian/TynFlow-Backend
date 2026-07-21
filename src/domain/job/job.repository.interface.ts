import { Job, JobDto, Params } from "./job.type";

export interface IJobRepository {
    getAll(params: Params, userId: string): Promise<{ jobs: Job[], count: number }>
    getById(id: string, userId: string): Promise<Job>
    create(dto: JobDto, userId: string): Promise<void>
    update(id: string, dto: JobDto, userId: string): Promise<void>
    delete(id: string, userId: string): Promise<void>
}