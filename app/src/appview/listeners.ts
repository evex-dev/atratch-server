import type { DidResolver } from "@atproto/identity";
import type { BlobRef } from "@atproto/lexicon";
import type { InputJsonValue } from "@prisma/client/runtime/library";
import type { appviewContext } from "../types";
import * as LandEvexAtratchAssetMap from "./lexicon/types/land/evex/atratch/assetMap";
import * as LandEvexAtratchProject from "./lexicon/types/land/evex/atratch/project";
import * as LandEvexAtratchProjectMeta from "./lexicon/types/land/evex/atratch/projectMeta";
import type { Sub } from "./sub";

export function addListeners(ctx: appviewContext, sub: Sub) {
	const pg = ctx.postgres;
	sub.onCreate("land.evex.atratch.project", async (ev) => {
		const res = LandEvexAtratchProject.validateRecord(ev.commit.record);
		if (!res.success) return;
		const rec = ev.commit.record as LandEvexAtratchProject.Record;
		await pg.project.upsert({
			where: { user_rkey: { user: ev.did, rkey: ev.commit.rkey } },
			create: {
				projectJson: rec as InputJsonValue,
				assetMap: [],
				createdAt: new Date(ev.time_us / 1000),
				description: "",
				title: "",
				rkey: ev.commit.rkey,
				user: ev.did,
			},
			update: { projectJson: rec as InputJsonValue },
		});
	});
	sub.onCreate("land.evex.atratch.assetMap", async (ev) => {
		const res = LandEvexAtratchAssetMap.validateRecord(ev.commit.record);
		if (!res.success) return;
		const rec = ev.commit.record as LandEvexAtratchAssetMap.Record & { $type: string };
		const m: Record<string, string> = {};
		for (const d of rec.map) {
			const bloburl = await createBlobLink(ctx.didResolver, ev.did, d.blob);
			if (!bloburl) return;
			m[d.hash] = bloburl;
		}
		await pg.project.upsert({
			where: { user_rkey: { user: ev.did, rkey: ev.commit.rkey } },
			create: {
				projectJson: {},
				assetMap: m,
				createdAt: new Date(ev.time_us / 1000),
				description: "",
				title: "",
				rkey: ev.commit.rkey,
				user: ev.did,
			},
			update: { assetMap: m },
		});
	});
	sub.onCreate("land.evex.atratch.projectMeta", async (ev) => {
		const res = LandEvexAtratchProjectMeta.validateRecord(ev.commit.record);
		if (!res.success) return;
		const rec = ev.commit.record as LandEvexAtratchProjectMeta.Record & { $type: string };
		await pg.project.upsert({
			where: { user_rkey: { user: ev.did, rkey: ev.commit.rkey } },
			create: {
				projectJson: {},
				assetMap: [],
				createdAt: new Date(ev.time_us / 1000),
				description: rec.meta.description,
				title: rec.meta.title,
				rkey: ev.commit.rkey,
				user: ev.did,
			},
			update: { description: rec.meta.description, title: rec.meta.title },
		});
	});
}

async function createBlobLink(resolver: DidResolver, did: string, blob: BlobRef) {
	const res = await resolver.resolve(did);
	if (!res) return;
	const endpoint = res.service?.filter((v) => v.id === "#atproto_pds")[0];
	if (!endpoint || typeof endpoint.serviceEndpoint !== "string") return;
	const url = new URL("/xrpc/com.atproto.sync.getBlob", endpoint.serviceEndpoint);
	url.searchParams.set("did", did);
	url.searchParams.set("cid", blob.ref.toString());
	return url.toString();
}
