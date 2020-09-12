# Getters

<sponsor-cb-sidebar/>

All ES6 getter functions of the class are converted into vuex getters

For example, the following code -

```typescript {6-8}
import { Module, VuexModule } from 'vuex-module-decorators'

@Module
export default class Vehicle extends VuexModule {
  wheels = 2
  get axles() {
    return this.wheels / 2
  }
}
```

is equivalent of this -

```js {6}
export default {
  state: {
    wheels: 2
  },
  getters: {
    axles: (state) => state.wheels / 2
  }
}
```
For Method-Style Access use vanilla vuex and return a function: 

```
@Module
export default class Vehicle extends VuexModule {
  companies = []
  get company() {
    return (companyName: string) => { this.companies.find(company => company.name === companyName) };
  }
}
```
