import { Redis } from "ioredis";
import postgres from "postgres";

export class RedisClient extends Redis {
	constructor() {
		super({ host: "redis", port: 6379, password: process.env.REDIS_PASSWORD });
	}
}

export class PostgresClient {
	q: postgres.Sql;
	constructor() {
		const e = () => {
			throw new Error("env error");
		};
		this.q = postgres({
			host: "postgres",
			username: process.env.POSTGRES_USER ?? e(),
			database: "main",
			password: process.env.POSTGRES_PASSWORD ?? e(),
			port: 5432,
		});
	}
}