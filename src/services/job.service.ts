import { IJobRepository } from "../domain/job/job.repository.interface";
import { Job, JobDto, Params } from "../domain/job/job.type";

export class JobService {
    constructor(private jobRepo: IJobRepository) {}

    async getAll(params: Params, userId: string): Promise<{ jobs: Job[], count: number }> {
        return this.jobRepo.getAll(params, userId)
    }
    async getById(id: string, userId: string): Promise<Job> {
        return this.jobRepo.getById(id, userId)
    }
    async create(dto: JobDto, userId: string): Promise<void> {
        return this.jobRepo.create(dto, userId)
    }
    async update(id: string, dto: JobDto, userId: string): Promise<void> {
        return this.jobRepo.update(id, dto, userId)
    }
    async delete(id: string, userId: string): Promise<void> {
        return this.jobRepo.delete(id, userId)
    }
}