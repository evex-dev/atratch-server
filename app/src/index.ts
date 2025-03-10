import { DidResolver, HandleResolver, MemoryCache } from "@atproto/identity";
import { serve } from "@hono/node-server";
import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { appview } from "./appview";
import { RedisClient } from "./db.js";
import server from "./server/index.js";
import type { appviewContext } from "./types.js";
import { wellKnown } from "./well-known.js";

const app = new Hono();
const didResolver = new DidResolver({ plcUrl: "https://plc.directory", didCache: new MemoryCache() });
const context: appviewContext = {
	url: "atratch-api.evex.land",
	redis: new RedisClient(),
	postgres: new PrismaClient(),
	didResolver,
	handleResolver: new HandleResolver(),
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
