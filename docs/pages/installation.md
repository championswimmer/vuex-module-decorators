# Installation

<sponsor-cb-sidebar/>

```bash
npm install vuex-module-decorators
# or
yarn add vuex-module-decorators
```

## ES5 Transpilation

This package is distributed with ES2015 style code. Which means it is perfectly fine
for modern browsers (Chrome, Firefox, Safari), but will not work on IE11.
If you are using IE11 you are probably having a Babel-based transpilation setup to
generate ES5 code. If that's the case, you need to make sure this package also gets
transpiled.

Add this in your `vue.config.js` (Vue CLI v3)

```js
// vue.config.js
module.exports = {
  // ... your other options
  transpileDependencies: [
    'vuex-module-decorators'
  ]
}
```

## Transpiler Configurations

### Babel 6/7

1. You need to install `babel-plugin-transform-decorators`

### Typescript

1. set `experimentalDecorators` to true
2. (Tip) For reduced code with decorators, set `importHelpers: true` in `tsconfig.json`
3. *(only for TypeScript 2)* set `emitHelpers: true` in `tsconfig.json`

:::tip NOTE
We do not need `emitDecoratorMetadata` as we do not depend on `reflect-metadata`
:::
