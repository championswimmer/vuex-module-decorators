import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Action, Module, Mutation, MutationAction, VuexModule } from '..'
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
