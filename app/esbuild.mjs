import esbuild from "esbuild";

esbuild
	.build({
		entryPoints: ["./src/index.ts"],
		outdir: "./dist",
		bundle: true,
		platform: "node",
		format: "esm",
		target: "esnext",
		resolveExtensions: [".ts", ".js"],
	})
	.catch(() => process.exit(1));
