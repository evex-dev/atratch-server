import { AtUri, isDid } from "@atproto/api";
import { InvalidRequestError } from "@atproto/xrpc-server";
import type { appviewContext } from "../types";
import { checkAuthFactory } from "./auth";
import { createServer } from "./lexicon/index";

const e = (er: Error = new Error()) => {
	throw er;
};

export function server({ postgres: pg, url, didResolver, handleResolver }: appviewContext) {
	// const server = new Hono();
	const s = createServer();
	const auth = checkAuthFactory({ ownDid: `did:web:${url}`, must: false });
	s.land.evex.atratch.getProject({
		auth,
		handler: async (c) => {
			const viewerDid = c.auth.credentials?.iss;
			const uri = new AtUri(c.params.uri);
			const did = isDid(uri.host)
				? uri.host
				: ((await handleResolver.resolve(uri.host)) ?? e(new InvalidRequestError("cannot resolve handle")));
			const project = await pg.project.findUnique({
				where: { user_rkey: { user: did, rkey: uri.rkey } },
				include: { _count: true, like: viewerDid ? { where: { user: viewerDid ?? "!!!!NO MATCH" } } : false },
			});
			if (!project) throw new InvalidRequestError("project not found");

			const meta = { description: project.description, title: project.title };
			const assetMap = project.assetMap ?? {};
			const projectJson = project.projectJson ?? {};
			const likeCount = project._count.like;
			const vlike = project.like[0];
			const viewerState = vlike ? { like: `at://${vlike.user}/evex.land.atratch.like/${vlike.key}` } : undefined;

			return {
				encoding: "application/json",
				body: { project: { meta, assetMap, like: likeCount, projectJson }, viewer: viewerState },
			};
		},
	});
	return s.xrpc.createApp();
}
