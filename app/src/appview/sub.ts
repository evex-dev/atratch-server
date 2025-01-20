import { type CommitCreateEvent, type CommitDeleteEvent, type CommitUpdateEvent, Jetstream } from "@skyware/jetstream";
import ws from "ws";

const wantedCollections = [
	"land.evex.atratch.project",
	"land.evex.atratch.assetMap",
	"land.evex.atratch.projectMeta",
	"land.evex.atratch.like",
] as const;
type colType = (typeof wantedCollections)[number];
export class Sub {
	private jet: Jetstream<colType, colType>;
	constructor(saveCursor: (c: number) => Promise<void>, cursor?: number) {
		this.jet = new Jetstream({
			endpoint: "wss://jetstream2.us-west.bsky.network/subscribe",
			ws,
			wantedCollections: wantedCollections.slice(),
			cursor,
		});
		this.jet.on("close", () => this.jet.start());
		this.jet.on("error", (error, cursor) => {
			console.error(error);
			this.jet.cursor = cursor;
			this.jet.start();
		});
		this.jet.on("commit", () => {
			this.jet.cursor && saveCursor(this.jet.cursor);
		});
	}
	public start() {
		this.jet.start();
	}
	public onCreate<T extends colType>(col: T, fn: (ev: CommitCreateEvent<T>) => void) {
		this.jet.onCreate(col, fn);
	}
	public onUpdate<T extends colType>(col: T, fn: (ev: CommitUpdateEvent<T>) => void) {
		this.jet.onUpdate(col, fn);
	}
	public onDelete<T extends colType>(col: T, fn: (ev: CommitDeleteEvent<T>) => void) {
		this.jet.onDelete(col, fn);
	}
}
