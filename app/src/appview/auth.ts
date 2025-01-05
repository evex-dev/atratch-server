import {
	AuthRequiredError,
	cryptoVerifySignatureWithKey,
	verifyJwt,
	type VerifySignatureWithKeyFn,
} from "@atproto/xrpc-server";
import type { HonoAuthVerifier } from "@evex/xrpc-hono";
import type { Context } from "hono";
import { IdResolver, MemoryCache } from "@atproto/identity";
import { parseDidKey, SECP256K1_JWT_ALG } from "@atproto/crypto";
import crypto from "node:crypto";
import KeyEncoder from "key-encoder";
import { parseUrlNsid } from "@atproto/xrpc-server/dist/util";
const idResolver = new IdResolver({ didCache: new MemoryCache() });
type authParam = Parameters<HonoAuthVerifier>[0];
type authSuccess = { credentials: { type: "standard"; iss: string; aud: string } };
type authMissing = { credentials: undefined };

export function checkAuthFactory(p: { ownDid: string; must: true }): (arg0: authParam) => Promise<authSuccess>;
export function checkAuthFactory(p: { ownDid: string; must: false }): (
	arg0: authParam,
) => Promise<authSuccess | authMissing>;
export function checkAuthFactory({ ownDid, must }: { ownDid: string; must: boolean }) {
	return async ({ ctx }: authParam) => {
		//Bearer以外(Basicとか)は管理者用っぽいのでBearerだけでいいはず
		if (!isBearerToken(ctx)) {
			if (must) {
				throw new AuthRequiredError(undefined, "AuthMissing");
			} else {
				return { credentials: undefined };
			}
		}
		const jwtStr = bearerTokenFromReq(ctx);
		if (!jwtStr) throw new AuthRequiredError("missing jwt", "MissingJwt");
		//DID Docから公開鍵を取得してjwtの署名検証
		const payload = await verifyJwt(jwtStr, null, null, getSigningKey, verifySignatureWithKey);
		//jwtのaudが自分のdidと一致しているか確認
		if (payload.aud !== ownDid)
			throw new AuthRequiredError("jwt audience does not match service did", "BadJwtAudience");
		//jwtのlxmを検証
		const nsid = parseUrlNsid(ctx.req.url);
		if (payload.lxm !== nsid) {
			throw new AuthRequiredError(
				payload.lxm !== undefined
					? `bad jwt lexicon method ("lxm"). must match: ${nsid}`
					: `missing jwt lexicon method ("lxm"). must match: ${nsid}`,
				"BadJwtLexiconMethod",
			);
		}
		return {
			credentials: {
				type: "standard",
				iss: payload.iss,
				aud: payload.aud,
			},
		};
	};
}

const getSigningKey = async (iss: string, forceRefresh: boolean): Promise<string> => {
	const [did, serviceId] = iss.split("#");
	const keyId = serviceId === "atproto_labeler" ? "atproto_label" : "atproto";
	console.log(`iss: ${iss}`);
	const identity = await idResolver.did.resolve(did, forceRefresh);
	console.log("identity:");
	console.dir(identity);
	if (!identity || !identity.verificationMethod) throw new AuthRequiredError("identity unknown");
	for (const method of identity.verificationMethod) {
		if (method.id === [did, keyId].join("#")) {
			if (!method.publicKeyMultibase) throw new AuthRequiredError("missing or bad key");
			return method.publicKeyMultibase;
		}
	}
	throw new AuthRequiredError("missing or bad key");
};
//ES256Kむけの実装を分岐している。それ以外の方式はこの関数いらなそう
const verifySignatureWithKey: VerifySignatureWithKeyFn = async (
	didKey: string,
	msgBytes: Uint8Array,
	sigBytes: Uint8Array,
	alg: string,
) => {
	if (alg === SECP256K1_JWT_ALG) {
		const parsed = parseDidKey(didKey);
		if (alg !== parsed.jwtAlg) {
			throw new Error(`Expected key alg ${alg}, got ${parsed.jwtAlg}`);
		}
		return verifySig(parsed.keyBytes, msgBytes, sigBytes);
	}
	return cryptoVerifySignatureWithKey(didKey, msgBytes, sigBytes, alg);
};
const verifySig = (publicKey: Uint8Array, data: Uint8Array, sig: Uint8Array) => {
	const keyEncoder = new KeyEncoder("secp256k1");
	const pemKey = keyEncoder.encodePublic(ui8ToString(publicKey, "hex"), "raw", "pem");
	const key = crypto.createPublicKey({ format: "pem", key: pemKey });
	return crypto.verify("sha256", data, { key, dsaEncoding: "ieee-p1363" }, sig);
};

const BEARER = "Bearer ";
const isBearerToken = (c: Context): boolean => {
	return c.req.header().authorization?.startsWith(BEARER) ?? false;
};
const bearerTokenFromReq = (c: Context) => {
	const header = c.req.header().authorization || "";
	if (!header.startsWith(BEARER)) return null;
	return header.slice(BEARER.length).trim();
};

function ui8ToString(ui8: Uint8Array, encoding: string): string {
	return new TextDecoder(encoding).decode(ui8);
}
