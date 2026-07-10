import { Variables } from './../config/env';
import { Hono } from "hono";
import { Bindings } from "../config/env";
import { requireAuth } from '../middlewares/auth.middleware';
import { SchedulerRepository } from '../repositories/scheduler.repository';
import { SchedulerService } from '../services/scheduler.service';
import { SchedulerDto } from '../domain/scheduler/scheduler.type';

const schedulerRoute = new Hono<{ Bindings: Bindings, Variables: Variables }>();

function getSchedulerService(c: any) {
    const repo = new SchedulerRepository(c.get("supabase"));
    return new SchedulerService(repo);
}

schedulerRoute.get("/", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const service = getSchedulerService(c);
    const schedulers = await service.getAll(userId);

    return c.json({
        success: true,
        data: schedulers,
        message: "Schedulers fetched successfully"
    }, 200);
});

schedulerRoute.post("/", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const service = getSchedulerService(c);
    const dto = await c.req.json();
    await service.create(dto, userId);

    return c.json({
        success: true,
        message: "Scheduler created successfully"
    }, 201);
});

schedulerRoute.put("/:id", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const service = getSchedulerService(c);
    const id = c.req.param("id");
    if (!id) return c.json({
        success: false,
        message: "Scheduler ID is required"
    }, 400);

    const dto = await c.req.json();
    await service.update(id, dto, userId);

    return c.json({
        success: true,
        message: "Scheduler updated successfully"
    }, 200);
});

schedulerRoute.delete("/:id", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const service = getSchedulerService(c);
    const id = c.req.param("id");
    if (!id) return c.json({
        success: false,
        message: "Scheduler ID is required"
    }, 400);

    await service.delete(id, userId);

    return c.json({
        success: true,
        message: "Scheduler deleted successfully"
    }, 200);
});

schedulerRoute.patch("/:id/activate", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const service = getSchedulerService(c);
    const id = c.req.param("id");
    if (!id) return c.json({
        success: false,
        message: "Scheduler ID is required"
    }, 400);

    await service.activate(id, userId);

    return c.json({
        success: true,
        message: "Scheduler activated successfully"
    }, 200);
});

schedulerRoute.patch("/:id/deactivate", requireAuth, async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({
        success: false,
        message: "Unauthenticated"
    }, 401);

    const service = getSchedulerService(c);
    const id = c.req.param("id");
    if (!id) return c.json({
        success: false,
        message: "Scheduler ID is required"
    }, 400);

    await service.deactive(id, userId);

    return c.json({
        success: true,
        message: "Scheduler deactivated successfully"
    }, 200);
});

export default schedulerRoute;