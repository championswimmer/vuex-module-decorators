import Vuex, { Module as Mod } from 'vuex'
import { createApp } from 'vue'

import { Action, Module, Mutation, MutationAction, VuexModule } from '..'
import { expect } from 'chai'

@Module({ namespaced: true })
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
const app = createApp({})
app.use(store)

describe('fetching via namespaced getters works', () => {
  it('should increase axles', function() {
    store.commit('mm/incrWheels', 4)
    const axles = store.getters['mm/axles']
    expect(axles).to.equal(3)
  })
})
