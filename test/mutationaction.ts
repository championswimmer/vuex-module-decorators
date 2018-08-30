import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import {Module, MutationAction, VuexModule} from '../dist'
import {expect} from 'chai'

@Module
class MyModule extends VuexModule {
  count = 0

  @MutationAction({mutate: ['count']})
  async updateCount (newcount: number) {
    return {count: newcount}
  }

}

const store = new Vuex.Store({
  modules: {
    mm: MyModule
  }
})

describe('dispatching moduleaction works', () => {
  it('should update count', function (done) {

    store.dispatch('updateCount', 2).then(() => {
      expect(parseInt(store.state.mm.count)).to.equal(2)
      done()
    }).catch(done)

  })
})
