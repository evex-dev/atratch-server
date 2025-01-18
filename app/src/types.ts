import type { PrismaClient, Prisma } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import type { RedisClient } from "./db";

export type appviewContext = {
	url: string;
	redis: RedisClient;
	postgres: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
};
