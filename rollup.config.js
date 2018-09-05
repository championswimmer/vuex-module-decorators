import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

export default [
    {
        input: 'src/index.ts',
        output: {
            file: "dist/index.min.js",
            format: "cjs",
            name: "vuex-module-decorators",
            sourcemap: true,
            exports: 'named',
            interop: false,
        },
        external: [ "vuex" ],
        plugins: [ typescript(), terser() ]
    }
];