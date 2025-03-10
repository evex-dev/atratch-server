import esbuild from "esbuild";
esbuild
	.build({
		entryPoints: ["./src/index.ts"],
		outdir: "./dist",
		bundle: true,
		platform: "node",
		format: "cjs",
		target: "esnext",
		resolveExtensions: [".ts", ".js"],
		logLevel: "info",
		define: {
			"process.env.BUILD_TIMESTAMP": JSON.stringify(new Date().toLocaleString("ja", { timeZone: "Japan" })),
		},
	})
	.catch(() => process.exit(1));
