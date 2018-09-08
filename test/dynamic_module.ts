import Vuex, {Module as Mod} from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import {Action, Module, Mutation, MutationAction, VuexModule} from '../'
import {expect} from 'chai'

interface StoreType {
  mm: MyModule
}
const store = new Vuex.Store<StoreType>({
})

@Module({dynamic: true, store: store, name: 'mm'})
class MyModule extends VuexModule {
  count = 0

  @Mutation
  incrCount(delta: number) {
    this.count += delta
  }

}



describe('mutation works on dynamic module', () => {
  it('should update count', function () {

    store.commit('incrCount', 5)
    expect(store.state.mm.count).to.equal(5)

  })
})
