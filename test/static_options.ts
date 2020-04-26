import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Action, Module, Mutation, MutationAction, VuexModule, newStore } from '..'
import { expect } from 'chai'

interface MyModule {
  count: number
}

@Module
class MyModule extends VuexModule {
  static namespaced = true

  static state () {
    return { count: 0 }
  }

  @Mutation
  incrCount(delta: number) {
    this.count += delta
  }
}

describe('static module statics work', () => {
  it('should update count', function() {
    const store = newStore({
      modules: {
        mm: MyModule
      }
    })
    store.getters.$statics.mm.incrCount(5)
    expect(parseInt(store.state.mm.count)).to.equal(5)
  })
})

describe('static root module statics work', () => {
  it('should update count', function() {
    const store = newStore(MyModule)
    store.getters.$statics.incrCount(5)
    expect(parseInt(store.state.count)).to.equal(5)
  })
})

const store = new Vuex.Store({
  modules: {
    mm: MyModule
  }
})

describe('static module properties work', () => {
  it('should update count', function() {
    store.commit('mm/incrCount', 5)
    expect(parseInt(store.state.mm.count)).to.equal(5)
  })
})
