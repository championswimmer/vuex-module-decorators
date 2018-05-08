# vuex-module-decorators

Typescript/ES7 Decorators to make Vuex modules a breeze

[![Build Status](https://travis-ci.org/championswimmer/vuex-module-decorators.svg?branch=master)](https://travis-ci.org/championswimmer/vuex-module-decorators)
[![codecov](https://codecov.io/gh/championswimmer/vuex-module-decorators/branch/master/graph/badge.svg)](https://codecov.io/gh/championswimmer/vuex-module-decorators)
[![npm](https://img.shields.io/npm/v/vuex-module-decorators.svg)](https://www.npmjs.com/package/vuex-module-decorators)
[![npm](https://img.shields.io/npm/dw/vuex-module-decorators.svg?colorB=ff0033)](https://www.npmjs.com/package/vuex-module-decorators)

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
