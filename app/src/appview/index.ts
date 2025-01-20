import type { appviewContext } from "../types";
import { checkAuthFactory } from "./auth";
import { createServer } from "./lexicon/index";

export default function server(ctx: appviewContext) {
	// const server = new Hono();
	const s = createServer();
	const auth = checkAuthFactory({ ownDid: `did:web:${ctx.url}`, must: false });
	s.land.evex.atratch.getProject({
		auth,
		handler: (c) => {
			const you = c.auth.credentials?.iss;
			const meta = { description: "test description", title: "test title" };
			const assetMap = {};
			const projectJson = {};
			return { encoding: "application/json", body: { project: { meta, assetMap, like: 0, projectJson } } };
		},
	});
	return s.xrpc.createApp();
}
