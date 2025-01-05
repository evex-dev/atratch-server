import { Hono } from "hono";
import { LexiconDoc } from "@atproto/lexicon";
import {AuthVerifier,verifyJwt} from "@atproto/xrpc-server";
import { createServer } from "./lexicon/index";
import {HonoAuthVerifier}from "@evex/xrpc-hono"
import { checkAuthFactory } from "./auth";

export default function server() {
	// const server = new Hono();
	const s = createServer();
	const auth=checkAuthFactory({ownDid:"did:example",must:false})
	s.land.evex.atratch.getProjectMeta({auth,handler:(c) => {
		const you=c.auth.credentials?.iss
		const project= {credit:"test credit",description:"test description",title:"test title"}
		return { encoding: "application/json", body: { project,you } };
	}});
	s.land.evex.atratch.test({auth,handler:(c) => {
		const echo=c.input.body.echo
		const you=c.auth.credentials?.iss
		return { encoding: "application/json", body: { echo,you }, };
	},});
	return s.xrpc.createApp()
}
