# Actions

All functions that are decorated with `@Action` are converted into
vuex actions.

For example this code -

```typescript {13-17}
import {Module, VuexModule, Mutation} from 'vuex-module-decorators'
import {get} from 'request'

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
        this.commit('addWheel', wheels)
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
        addWheel: (state, payload) => {state.wheels = state.wheels + payload}
    },
    actions: {
        fetchNewWheels: async (context, payload) => {
            const wheels = await request.get(payload)
            context.commit('addWheel', wheels)
        }
    }
}
```
