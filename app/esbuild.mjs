import { builtinModules } from "node:module";
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
			"process.env.BUILD_TIMESTAMP": JSON.stringify(new Date().toLocaleString("ja")),
		},
	})
	.catch(() => process.exit(1));
