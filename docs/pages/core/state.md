# State

All properties of the class are converted into state props.
For example, the following code - 
```typescript {5}
import {Module, VuexModule} from 'vuex-module-decorators'

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