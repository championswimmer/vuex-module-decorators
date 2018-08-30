import Vuex, {Module as Mod} from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import {Action, Module, Mutation, MutationAction, VuexModule} from '../dist'
import {expect} from 'chai'

@Module
class MyModule extends VuexModule {
  count = 0

  @Mutation
  incrCount(delta: number) {
    this.count += delta
  }

  @Action({commit: 'incrCount'})
  async getCountDelta() {
    return 5
  }

}

const store = new Vuex.Store({
  modules: {
    mm: MyModule
  }
})

describe('dispatching action which mutates works', () => {
  it('should update count', function (done) {

    store.dispatch('getCountDelta').then(() => {
      expect(parseInt(store.state.mm.count)).to.equal(5)
      done()
    }).catch(done)

  })
})
