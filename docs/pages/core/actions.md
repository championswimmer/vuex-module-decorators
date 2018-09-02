# Actions

All functions that are decorated with `@Action` are converted into
vuex actions.

For example this code - 

```typescript {7-10}
import {Module, VuexModule, Mutation} from 'vuex-module-decorators'
import {St}

@Module
export default class Vehicle extends VuexModule {
    wheels = 2

    @Mutation
    addWheel(n: number) {
        this.wheels = this.wheels + n
    }

    @Action
    async function(context:) {

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
        puncture: (state, payload) => {state.wheels = state.wheels - payload}
    }
}
```
