import { Hono } from "hono";
import { Bindings, Variables } from "../config/env";
import { JobService } from "../services/job.service";
import { requireAuth } from "../middlewares/auth.middleware";
import { JobRepository } from "../repositories/job.repository";
import { Params } from "../domain/job/job.type";

const jobRoute = new Hono<{ Bindings: Bindings, Variables: Variables }>();

function getJobService(c: any) {
    const repo = new JobRepository(c.get("supabase"));
    return new JobService(repo);
}

jobRoute.get("/", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const page = parseInt(c.req.query("page") ?? "1");
    const limit = parseInt(c.req.query("limit") ?? "10");
    const search = c.req.query("search");

    const params: Params = {
        page,
        limit,
        search
    }

    const service = getJobService(c);
    const items = await service.getAll(params, userId);

    return c.json({
        success: true,
        data: items,
        message: "Jobs fetched successfully"
    }, 200)
})

jobRoute.post("/", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401)

    const body = await c.req.json();
    const service = getJobService(c);
    await service.create(body, userId);

    return c.json({
        success: true,
        message: "Job created successfully"
    }, 201)
})

jobRoute.get("/:id", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const id = c.req.param("id");
    if (!id) return c.json({
        success: false,
        message: "Job ID is required"
    }, 400)

    const service = getJobService(c);
    const item = await service.getById(id, userId);

    return c.json({
        success: true,
        data: item,
        message: "Job fetched successfully"
    }, 200)
})

jobRoute.put("/:id", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401)

    const id = c.req.param("id");
    if (!id) return c.json({
        success: false,
        message: "Job ID is required"
    }, 400)

    const body = await c.req.json();
    const service = getJobService(c);
    await service.update(id, body, userId);

    return c.json({
        success: true,
        message: "Job updated successfully"
    }, 200)
})

jobRoute.delete("/:id", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401)

    const id = c.req.param("id");
    if (!id) return c.json({
        success: false,
        message: "Job ID is required"
    }, 400)

    const service = getJobService(c);
    await service.delete(id, userId);

    return c.json({
        success: true,
        message: "Job deleted successfully"
    }, 200)
})

export default jobRoute;