import Vuex, { Module as Mod } from 'vuex'
import { createApp } from 'vue'

import { Action, Module, Mutation, MutationAction, VuexModule } from '..'
import { expect } from 'chai'

@Module
class MyModule extends VuexModule {
  count = 0

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
const app = createApp({})
app.use(store)

describe('committing mutation works', () => {
  it('should update count', function() {
    store.commit('incrCount', 5)
    expect(parseInt(store.state.mm.count)).to.equal(5)
  })
})
