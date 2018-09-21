# vuex-module-decorators

[![Usage Guide](https://img.shields.io/badge/usage-guide-1e90ff.svg?style=for-the-badge&longCache=true)](https://championswimmer.in/vuex-module-decorators/)

Typescript/ES7 Decorators to make Vuex modules a breeze

[![Build Status](https://travis-ci.org/championswimmer/vuex-module-decorators.svg?branch=master)](https://travis-ci.org/championswimmer/vuex-module-decorators)
[![npm:size:gzip](https://img.shields.io/bundlephobia/minzip/vuex-module-decorators.svg?label=npm:size:gzip)](https://bundlephobia.com/result?p=vuex-module-decorators)
[![cdn:min:gzip](https://img.badgesize.io/https://cdn.jsdelivr.net/npm/vuex-module-decorators/dist/cjs/index.min.js?label=cdn:min:gzip)](https://cdn.jsdelivr.net/npm/vuex-module-decorators/dist/cjs/index.min.js)
[![codecov](https://codecov.io/gh/championswimmer/vuex-module-decorators/branch/master/graph/badge.svg)](https://codecov.io/gh/championswimmer/vuex-module-decorators)
[![npm](https://img.shields.io/npm/v/vuex-module-decorators.svg)](https://www.npmjs.com/package/vuex-module-decorators)
[![npm](https://img.shields.io/npm/dw/vuex-module-decorators.svg?colorB=ff0033)](https://www.npmjs.com/package/vuex-module-decorators)
![npm type definitions](https://img.shields.io/npm/types/vuex-module-decorators.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/5b1dfa8d3d4bdf409b60/maintainability)](https://codeclimate.com/github/championswimmer/vuex-module-decorators/maintainability)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b7944c579d5c4c1d949f71a91a538d77)](https://www.codacy.com/app/championswimmer/vuex-module-decorators?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=championswimmer/vuex-module-decorators&amp;utm_campaign=Badge_Grade)

## Installation

```
npm install -D vuex-module-decorators
```
### Babel 6/7

1. You need to install `babel-plugin-transform-decorators`

### Typescript

1. set `experimentalDecorators` to true
2. For reduced code with decorators, set `emitHelpers: true` and `importHelpers: true`

## Usage

#### The <strike>conventional</strike> old & boring way

Remember how vuex modules used to be made ?

```js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})
```


#### Hello Decorators !

Well not anymore. Now you get better syntax. Inspired by `vue-class-component`

```typescript
import {Module, VuexModule, Mutation, Action} from 'vuex-module-decorators' 

@Module
export default class Counter2 extends VuexModule {
  count = 0

  @Mutation increment(delta: number) {this.count+=delta}
  @Mutation decrement(delta: number) {this.count-=delta}

  // action 'incr' commits mutation 'increment' when done with return value as payload
  @Action({commit: 'increment'}) incr() {return 5}
  // action 'decr' commits mutation 'decrement' when done with return value as payload
  @Action({commit: 'decrement'}) decr() {return 5}
}
```

#### async MutationAction === magic

Want to see something even better ?

```typescript
import {Module, VuexModule, MutationAction} from 'vuex-module-decorators'
import {ConferencesEntity, EventsEntity} from '@/models/definitions' 

@Module
export default class HGAPIModule extends VuexModule {
  conferences: Array<ConferencesEntity> = []
  events: Array<EventsEntity> = []

  // 'events' and 'conferences' are replaced by returned object
  // whose shape must be `{events: {...}, conferences: {...} }`
  @MutationAction({mutate: ['events', 'conferences']})
  async fetchAll () {
    const response: Response = await getJSON('https://hasgeek.github.io/events/api/events.json')
    return response
  }
}
```

#### Automatic getter detection
```typescript
@Module
class MyModule extends VuexModule {
  wheels = 2

  @Mutation
  incrWheels(extra) {
    this.wheels += extra
  }

  get axles() {
    return (this.wheels / 2)
  }

}
```

this is turned into the equivalent

```javascript
const module = {
  state: {wheels: 2},
  mutations: {
    incrWheels(state, extra) {
      state.wheels += extra
    }
  },
  getters: {
    axles: (state) => state.wheels / 2
  }
}
```


### Putting into the store

Use the modules just like you would earlier

```typescript
import Vue from 'nativescript-vue';
import Vuex, {Module} from 'vuex'

import counter from './modules/Counter2';
import hgapi from './modules/HGAPIModule'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  modules: {
    counter,
    hgapi
  }
});
```

### Module re-use, use with NuxtJS

If you need to support [module reuse](https://vuex.vuejs.org/guide/modules.html#module-reuse)
or to use modules with NuxtJS, you can have a state factory function generated instead
of a staic state object instance by using `stateFactory` option to `@Module`, like so:

```typescript
@Module({ stateFactory: true })
class MyModule extends VuexModule {
  wheels = 2

  @Mutation
  incrWheels(extra) {
    this.wheels += extra
  }

  get axles() {
    return (this.wheels / 2)
  }

}
```

this is turned into the equivalent

```javascript
const module = {
  state() {
    return {wheels: 2};
  },

  mutations: {
    incrWheels(state, extra) {
      state.wheels += extra
    }
  },
  getters: {
    axles: (state) => state.wheels / 2
  }
}
```

### Dynamic Modules

Vuex allows us to register modules into store at runtime after store is
constructed. We can do the following to create dynamic modules

```typescript
interface StoreType {
  mm: MyModule
}
// Declare empty store first
const store = new Vuex.Store<StoreType>({
})

// Create module later in your code (it will register itself automatically)
// In the decorator we pass the store object into which module is injected
// NOTE: When you set dynamic true, make sure you give module a name
@Module({dynamic: true, store: store, name: 'mm'})
class MyModule extends VuexModule {
  count = 0

  @Mutation
  incrCount(delta) {
    this.count += delta
  }

}

```
