import Vuex, {Module as Mod} from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import {Action, Module, Mutation, MutationAction, VuexModule} from '../dist'
import {expect} from 'chai'

@Module
class MyModule extends VuexModule {
  count = 0

  @Mutation
  incrCount(delta) {
    this.count += delta
  }

}

const store = new Vuex.Store({
  modules: {
    mm: MyModule
  }
})

describe('committing mutation works', () => {
  it('should update count', function () {

    store.commit('incrCount', 5)
    expect(parseInt(store.state.mm.count)).to.equal(5)

  })
})
