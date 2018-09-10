import Vuex, { Module as Mod, Store } from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Action, Module, Mutation, MutationAction, VuexModule } from '..'
import { expect } from 'chai'

@Module
class MyModule extends VuexModule {
  count = 0

  @Mutation
  incrCount(delta: number) {
    this.count += delta
  }

  @Action({ commit: 'incrCount' })
  async getCountDelta() {
    return 5
  }

  @Action
  fetchCountDelta() {
    this.commit('incrCount', 5)
  }
}

const store = new Vuex.Store({
  modules: {
    mm: MyModule
  }
})

describe('dispatching action which mutates works', () => {
  it('should update count (async)', function(done) {
    store
      .dispatch('getCountDelta')
      .then(() => {
        expect(parseInt(store.state.mm.count)).to.equal(5)
        done()
      })
      .catch(done)
  })
  it('should update count (sync)', async function() {
    await store.dispatch('fetchCountDelta')
    expect(parseInt(store.state.mm.count)).to.equal(10)
  })
})
