# Actions

<sponsor-cb-sidebar/>

All functions that are decorated with `@Action` are converted into
vuex actions.

For example this code -

```typescript {13-17}
import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { get } from 'request'

@Module
export default class Vehicle extends VuexModule {
  wheels = 2

  @Mutation
  addWheel(n: number) {
    this.wheels = this.wheels + n
  }

  @Action
  async fetchNewWheels(wheelStore: string) {
    const wheels = await get(wheelStore)
    this.context.commit('addWheel', wheels)
  }
}
```

is equivalent of this -

```js {9-14}
const request = require('request')
export default {
  state: {
    wheels: 2
  },
  mutations: {
    addWheel: (state, payload) => {
      state.wheels = state.wheels + payload
    }
  },
  actions: {
    fetchNewWheels: async (context, payload) => {
      const wheels = await request.get(payload)
      context.commit('addWheel', wheels)
    }
  }
}
```

:::tip NOTE
Once decorated with `@Action` the function will be called with `this`
having the following shape - `{...[all fields of state], context}`
The action payload comes as an argument.
So to commit a mutation manually from within action's body
simply call **`this.context.commit('mutationName', mutPayload)`**
:::

:::danger 🚨️️ WARNING
If you are doing a long running task inside your action, it is recommended
to define it as an **async** function. But even if you do not, this library
will wrap your function into a **Promise** and _await_ it.

If you want something to **actually** happen synchronously, make it a `Mutation` instead

Also **do not** define them as arrow :arrow_right: functions, since we need to rebind them at runtime.
:::
