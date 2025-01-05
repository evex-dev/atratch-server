import { serve } from "@hono/node-server";
import { Hono } from "hono";
import appview from "./appview/index.js";
import server from "./server/index.js";
import express, { Request as expressRequest } from "express";
import http from "node:http";
import { appviewContext } from "./types.js";
import { ValidationError } from "@atproto/lexicon";
import { InternalServerError, InvalidRequestError, XRPCError } from "@atproto/xrpc-server";
import { wellKnown } from "./well-known.js";

const app = new Hono();
const context:appviewContext={
	url:"atratch-api.evex.land"
}
app.get("/", (c) => {
	return c.text(
		'This is an AT Protocol Application View (AppView) for the "atratch.evex.land"\n\nMost API routes are under /xrpc/',
	);
});

app.route("/", appview());
app.route("/api", server());
app.route("/.well-known",wellKnown(context))

const port = 3000;
console.log(`Server is running on ${port}`);

serve({ fetch: app.fetch, port });