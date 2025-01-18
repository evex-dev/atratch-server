import { serve } from "@hono/node-server";
import { Hono } from "hono";
import appview from "./appview/index.js";
import server from "./server/index.js";
import type { appviewContext } from "./types.js";
import { wellKnown } from "./well-known.js";
import { RedisClient } from "./db.js";
import { PrismaClient } from "@prisma/client";

const app = new Hono();
const context: appviewContext = {
	url: "atratch-api.evex.land",
	redis: new RedisClient(),
	postgres: new PrismaClient(),
};
app.get("/", (c) => {
	return c.text(
		'This is an AT Protocol Application View (AppView) for the "atratch.evex.land"\n\nMost API routes are under /xrpc/',
	);
});

app.route("/", appview(context));
app.route("/api", server());
app.route("/.well-known", wellKnown(context));
app.get("/build_timestamp", (c) => {
	return c.body(process.env.BUILD_TIMESTAMP ?? "devmode?");
});

const port = 3000;
console.log(`Server is running on ${port}`);

serve({ fetch: app.fetch, port });
