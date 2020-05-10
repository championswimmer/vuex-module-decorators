import Vuex, { Module as Mod } from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Action, Module, Mutation, MutationAction, VuexModule } from '..'
import { expect } from 'chai'

@Module
class MyModule extends VuexModule {
  wheels = 2

  @Mutation
  incrWheels(extra: number) {
    this.wheels += extra
  }

  get axles() {
    return this.wheels / 2
  }
}

const store = new Vuex.Store({
  modules: {
    mm: MyModule
  }
})

describe('fetching via namespaced getters works', () => {
  it('should increase axles', function() {
    store.commit('mm/incrWheels', 4)
    const axles = store.getters['mm/axles']
    expect(axles).to.equal(3)
  })
})
