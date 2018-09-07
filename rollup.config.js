import typescript from 'rollup-plugin-typescript2'
import {
  terser
} from 'rollup-plugin-terser'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
        name: "vuex-module-decorators",
        sourcemap: true,
        exports: 'named',
        interop: false,
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
        name: "vuex-module-decorators",
        sourcemap: true,
        exports: 'named',
        interop: false,

      }
    ],
    external: ["vuex"],
    plugins: [typescript()]
  },
  {
    input: 'src/index.ts',
    output: {
      file: "dist/index.min.js",
      format: "cjs",
      name: "vuex-module-decorators",
      sourcemap: true,
    },
    external: ["vuex"],
    plugins: [typescript(), terser()]
  }
];