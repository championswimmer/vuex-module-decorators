import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import { Action, Module, Mutation, VuexModule } from '..'
import { expect } from 'chai'

@Module({ namespaced: false })
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

describe('committing mutation works', () => {
  it('should update count', function() {
    store.commit('incrCount', 5)
    expect(parseInt(store.state.mm.count)).to.equal(5)
  })
})
