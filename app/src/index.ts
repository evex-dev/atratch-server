import { serve } from "@hono/node-server";
import { Hono } from "hono";
import appview from "./appview/index.js";
import server from "./server/index.js";

const app = new Hono();

app.get("/", (c) => {
	return c.text(
		'This is an AT Protocol Application View (AppView) for the "atratch.evex.land"\n\nMost API routes are under /xrpc/',
	);
});

app.route("/xrpc", appview());
app.route("/api", server());

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({ fetch: app.fetch, port });
