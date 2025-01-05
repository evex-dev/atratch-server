import { Hono } from "hono";
import type { appviewContext } from "./types";

export function wellKnown(ctx: appviewContext) {
	const didDoc = {
		"@context": ["https://www.w3.org/ns/did/v1"],
		id: `did:web:${ctx.url}`,
		service: [
			{
				id: "#atratch_api",
				type: "AtratchAppview",
				serviceEndpoint: `https://${ctx.url}`,
			},
		],
	};
	const s = new Hono();
	s.get("did.json", async (c) => {
		return c.json(didDoc);
	});
	return s;
}
