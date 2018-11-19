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
    this.context.commit('incrCount', 5)
  }

  @Action({ rawError: true })
  async incrCountAction(payload) {
    const context = this.context
    await this.context.dispatch('getCountDelta')

    // Notice that the action we just called just deleted this action's this.context.
    // Because `this` is actually the vuex state and `context` was added on to `state` by
    // the action and then we called another action which then added the context and then deleted it
    // and now at this point this.context no longer exists
    expect(this.context).to.equal(context)
  }
}

const store = new Vuex.Store({
  modules: {
    mm: MyModule
  }
})

describe('dispatching action which mutates works', () => {
  it('should update count', async function() {
    await store.dispatch('getCountDelta')
    expect(parseInt(store.state.mm.count)).to.equal(5)
  })
  it('should update count (sync)', async function() {
    store.dispatch('fetchCountDelta')
    expect(parseInt(store.state.mm.count)).to.equal(10)
  })
})

describe('dispatching action which dipatches actions', () => {
  it(`should not remove the context off the first action's this`, async function() {
    await store.dispatch('incrCountAction')
    expect(parseInt(store.state.mm.count)).to.equal(15)
  })
})
