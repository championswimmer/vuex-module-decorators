import typescript from 'rollup-plugin-typescript2'
import {uglify} from 'rollup-plugin-uglify'

export default [
    {
        input: 'src/index.ts',
        output: {
            file: "dist/index.js",
            format: "cjs",
            name: "vuex-persist",
            sourcemap: true,
            exports: 'named',
            interop: false,
        },
        external: [ "vuex" ],
        plugins: [ typescript() ]
    },
    {
        input: 'dist/index.js',
        output: {
            file: 'dist/index.min.js',
            name: 'vuex-persist',
            format: 'cjs',
            sourcemap: true
        },
        external: [ 'vuex' ],
        plugins: [ uglify() ]
    }
    
];