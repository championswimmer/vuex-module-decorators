# State

<sponsor-cb-sidebar/>

All properties of the class are converted into state props.
For example, the following code -

```typescript {5}
import { Module, VuexModule } from 'vuex-module-decorators'

@Module
export default class Vehicle extends VuexModule {
  wheels = 2
}
```

is equivalent of this -

```js {3}
export default {
  state: {
    wheels: 2
  }
}
```

:::danger 🚨 WARNING
If state value cannot be determined, it **MUST** be initialized with `null`. Just like `wheels: number | null = null`.
:::
