import { Hono } from "hono";
import { Agent } from "@atproto/api";
export default function createServer() {
	const server = new Hono();

	server.get("/", (c) => {
		return c.text("appview test");
	});
	return server;
}
