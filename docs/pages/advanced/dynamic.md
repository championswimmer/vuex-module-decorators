# Dynamic Modules

:::tip
Before you read this secion, it is advised that you understand how
[dynamic module registration works](https://vuex.vuejs.org/guide/modules.html#dynamic-module-registration)
:::

Modules can be registered dynamically simply by passing a few properties into
the `@Module` decorator, but an important part of the process is, we first
create the store, and then pass the store to the module.

## Step 1: Create the Store

```typescript
// @/store/index.ts
import Vuex from 'vuex'

const store = new Vuex.Store({
  /*
  Ideally if all your modules are dynamic
  then your store is registered initially
  as a completely empty object
  */
})
```

## Step 2: Create the Dynamic Module

```typescript
// @/store/modules/MyModule.ts
import store from '@/store'
import {Module, VuexModule} from 'vuex-module-decorators'

@Module({dynamic: true, store, name: 'mm'})
export default class MyModule extends VuexModule {
  /*
  Your module definition as usual
  */
}

```

:::warning NOTE
As of now, we do not support dynamic + nested modules.
:::

:::danger IMPORTANT ⛔️
Make sure your imports/requires are ordered in such a way that
the store definition is executed before the module class is created.

It is important for the store to exist, and be passed into the
`@Module` decorator for the module to get registered dynamically
:::
