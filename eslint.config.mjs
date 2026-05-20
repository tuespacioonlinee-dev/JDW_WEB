import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // React 19 Compiler rules — demote to warn (event-handler mutations are intentional)
      "react-hooks/immutability": "warn",
      "react-hooks/refs": "warn",
      // API route export links must use <a>, not <Link>
      "@next/next/no-html-link-for-pages": "warn",
    },
  },
]);

export default eslintConfig;
