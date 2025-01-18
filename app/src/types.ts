import { PostgresClient, RedisClient } from "./db";

export type appviewContext = {
	url: string;
	redis:RedisClient
	postgres:PostgresClient
};
