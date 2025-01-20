import type { PrismaClient } from "@prisma/client";
import type { appviewContext } from "../types";
import { addListeners } from "./listeners";
import { server as createServer } from "./server";
import { Sub } from "./sub";

export function appview(ctx: appviewContext) {
	const server = createServer(ctx);
	startSub(ctx);
	return server;
}

async function startSub(ctx: appviewContext) {
	const oldCursor = (await getOrInitStatus(ctx.postgres)).cursor;
	const sub = new Sub(createSaveCursor(ctx.postgres), oldCursor ?? undefined);
	addListeners(ctx, sub);
}

async function getOrInitStatus(pg: PrismaClient) {
	const status = await pg.status.findFirst({ where: { id: "self" } });
	if (!status) {
		return await pg.status.create({ data: { id: "self" } });
	}
	return status;
}
function createSaveCursor(pg: PrismaClient) {
	return async (cursor: number) => void (await pg.status.update({ data: { cursor }, where: { id: "self" } }));
}
