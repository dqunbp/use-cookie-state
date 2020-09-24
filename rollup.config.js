import typescript from "rollup-plugin-typescript2";
import external from "rollup-plugin-peer-deps-external";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

const input = "src/index.ts";

const plugins = [external(), typescript(), terser()];

export default [
  {
    input,
    output: {
      file: pkg.module,
      format: "esm",
      sourcemap: true,
    },
    plugins,
  },
  {
    input,
    output: {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
    },
    plugins,
  },
];
