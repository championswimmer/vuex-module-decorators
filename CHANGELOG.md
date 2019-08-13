# CHANGELOG

If `(beta)` or `(alpha)` is marked in front of any release, it can be
installed as `npm install vuex-module-decorators@beta` (or alpha similar).

## 1.0.0

### 0.10.0

- Updated to TypeScript 3.5

#### 0.9.9

- added github actions

#### 0.9.5

- more typesafe `@MutationAction`
  - you cannot `mutate` keys not in the module
  - the returned object must be a partial of the module

#### 0.9.4

- initializing properties with `null` and then running `@MutationAction` is possible now

#### 0.9.3

- we will distribute in ES5 as a lot of people still use ES5 target for their websites

#### 0.9.1

- fix context getting lost in actions
  - via [pr 55](https://github.com/championswimmer/vuex-module-decorators/pull/55)
- add ability to access getters inside actions simply as `this.getterName`

### 0.9.0

- distribute as ES2015 (users need to transpile)

### 0.8.0

##### 0.8.0-4 (beta)

- inside getters we can access `rootState` and `rootGetters`
  - Use `this.context.rootState` and `this.context.rootGetters`

##### 0.8.0-3 (beta)

- in `@Action` and `@MutationAction` functions -
  - Now introduces `rawError` decorator option
    - By default they are set to false to keep the old behavior
    - Old behaviour - it is wrapped in a helper message
    - If set to true, errors inside actions will be thrown as it is
- in`@Action` functions -
  - `commit` decorator option can now be optional

##### 0.8.0-2 (beta)

- in `@Action` functions -
  - `this.stateField` works pointing to fields in the module's state
  - `this.context.commit('mutationName', payload)` is way to trigger mutation
  - `this.context.getters['getterName'])` is the way to use getters
  - **iff your module is dynamic** you get more typesafety
    - calling `this.mutationName(payload)` will work as well
    - accessing `this.getterName` will work as well

##### 0.8.0-0 (beta)

- allow `getModule()` even for non-dynamic modules

  > **NOTE:** From now on you have to use`getModule(ModuleClass)`
  > instead of the earlier `getModule(ModuleClass.prototype)`

- update to prettier code formatting

#### 0.7.1

- fix `unable to construct without new` error for transpiled ES5

### 0.7.0

- add `module` field to package.json for ES6 module loaders
  - tree-shaking supported

### 0.6.0

- distribute cjs, esm and minified cdn package separately

### 0.1.0

#### 0.0.1
