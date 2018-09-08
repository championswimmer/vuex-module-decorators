import typescript from 'rollup-plugin-typescript2'

export default [
  {
    input: 'src/index.ts',
    output: ['cjs', 'esm'].map(format => ({
      file: `dist/${format}/index.js`,
      format,
      name: 'vuex-module-decorators',
      sourcemap: true,
      exports: 'named'
    })),
    external: ['vuex'],
    plugins: [typescript({useTsconfigDeclarationDir: true})]
  }
]