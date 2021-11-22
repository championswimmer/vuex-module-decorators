import Vuex from 'vuex'
import { createApp } from 'vue'

import { Action, Module, Mutation, MutationAction, VuexModule } from '..'
import { expect } from 'chai'

@Module({ namespaced: true })
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
    store.commit('mm/incrCount', 5)
    expect(parseInt(store.state.mm.count)).to.equal(5)
  })
})
