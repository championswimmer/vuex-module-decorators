import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Module, Mutation, VuexModule } from '..'
import { expect } from 'chai'

interface MyModule {
  count: number
}

@Module
class MyModule extends VuexModule {
  static namespaced = true

  static state() {
    return { count: 0 }
  }

  @Mutation
  incrCount(delta: number) {
    this.count += delta
  }
}

@Module
class NextModule extends MyModule {
  static state() {
    return { count: 1, dogs: 1 }
  }
}

const store = new Vuex.Store({
  modules: {
    mm: NextModule
  }
})

describe('static module properties override', () => {
  it('should update new count', function () {
    store.commit('mm/incrCount', 5)
    expect(parseInt(store.state.mm.count)).to.equal(6)
  })
  it('should add new field', function () {
    expect(parseInt(store.state.mm.dogs)).to.equal(1)
  })
})
