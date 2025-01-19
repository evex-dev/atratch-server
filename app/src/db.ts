import { Redis } from "ioredis";

export class RedisClient extends Redis {
	constructor() {
		super({ host: "redis", port: 6379, password: process.env.REDIS_PASSWORD });
	}
}
