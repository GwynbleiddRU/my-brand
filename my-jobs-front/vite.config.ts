// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
// Subpath avoids resolving `main` (index.cjs), which require()s ESM-only lovable-tagger (ERR_REQUIRE_ESM on some setups).
import { defineConfig } from "@lovable.dev/vite-tanstack-config/dist/index.js";

export default defineConfig();
