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

:::danger 🚨 WARNING
Ensure that you do not have a getter or property in your module with the name `store`. This conflicts with `vuex-property-decorator` causing Vue "Too much recursion" errors.
:::
