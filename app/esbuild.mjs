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
		external: [
			...builtinModules, // Node.js 標準モジュール
			...builtinModules.map((mod) => `node:${mod}`), // ESM対応
			//"*", // すべてのモジュールを外部化
		],
		resolveExtensions: [".ts", ".js"],
		logLevel: "info",
	})
	.catch(() => process.exit(1));
