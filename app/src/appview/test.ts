import { Jetstream } from "@skyware/jetstream";
import ws from "ws";

const jet = new Jetstream({
	endpoint: "wss://jetstream2.us-west.bsky.network/subscribe",
	ws,
	wantedCollections: ["app.bsky.feed.generator", "app.bsky.actor.profile"],
	cursor: 1737394398562385,
});

jet.on("commit", (ev) => {
	console.log(jet.cursor);
});

jet.start();
