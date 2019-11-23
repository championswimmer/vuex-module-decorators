# Mutations

<sponsor-cb-sidebar/>

All functions decorated with `@Mutation` are converted into Vuex mutations
For example, the following code -

```typescript {7-10}
import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module
export default class Vehicle extends VuexModule {
  wheels = 2

  @Mutation
  puncture(n: number) {
    this.wheels = this.wheels - n
  }
}
```

is equivalent of this -

```js {6}
export default {
  state: {
    wheels: 2
  },
  mutations: {
    puncture: (state, payload) => {
      state.wheels = state.wheels - payload
    }
  }
}
```

:::tip NOTE
Once decorated with the `@Mutation` decorator _Mutations_ are run with **this** (context) set to the _state_
So when you want to change things in the state,
`state.item++` is simply `this.item++`
:::

:::danger 🚨 WARNING
Mutation functions **MUST NOT** be _async_ functions.
Also **do not** define them as arrow :arrow_right: functions, since we need to rebind them at runtime.
:::
