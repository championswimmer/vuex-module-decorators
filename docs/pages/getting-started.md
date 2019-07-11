# Getting Started

<sponsor-cb-sidebar/>

[[toc]]

## Define a module

To define a module, create a class that extends from `VuexModule`
and **must be** decorated with `Module` decorator

```typescript
// eg. /app/store/mymodule.ts
import { Module, VuexModule } from 'vuex-module-decorators'

@Module
export default class MyModule extends VuexModule {
  someField: string = 'somedata'
}
```

:::warning CAREFUL  
There is a `Module` class in the `vuex` package too, which is **not** a
decorator. Make sure you import correct Module decorator from from
`vuex-module-decorators`

:x: `import {Module} from 'vuex'`  
:heavy_check_mark: `import {Module} from 'vuex-module-decorators'`  
:::

## Use in store

In your store, you use the `MyModule` class itself as a module.

```typescript
import Vuex from 'vuex'
import MyModule from '~/store/mymodule'

const store = new Vuex.Store({
  modules: {
    myMod: MyModule
  }
})
```

:::tip NOTE  
The way we use the MyModule class is different from classical object-oriented programming
and similar to how [vue-class-component](https://npmjs.com/vue-class-component) works.
We use the class itself as module, not an object _constructed_ by the class

`new MyModule()` :x:  
:::

## Access State

All the usual ways of accessing the module works -

1. Import The store

   ```typescript {3}
   import store from '~/store'

   store.state.myMod.someField
   ```

2. Use `this.$store` if in component

   ```javascript {1}
   this.$store.state.myMod.someField
   ```

In addition to that, for a much more typesafe access, we can use `getModule()`

3. Use `getModule()` to create type-safe accessor

   ```typescript {8}
   import { Module, VuexModule, getModule } from 'vuex-module-decorators'
   import store from '@/store'

   @Module({ dynamic: true, store, name: 'mymod' })
   class MyModule extends VuexModule {
     someField: number = 10
   }
   const myMod = getModule(MyModule)
   myMod.someField //works
   myMod.someOtherField //Typescript will error, as field doesn't exist
   ```
