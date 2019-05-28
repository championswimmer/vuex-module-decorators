import Vuex, { Module as Mod, ModuleTree } from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Action, Module, Mutation, MutationAction, VuexModule } from '..'
import { expect } from 'chai'

interface StoreType {
  mm: MyModule
}
const store = new Vuex.Store<StoreType>({})

@Module({ dynamic: true, store, name: 'mm', preserveState: true })
class MyModule extends VuexModule {
  count = 0
}

describe('dynamic module with preserve data and empty initial state', () => {
  it('should init count to 0', function() {
    expect(store.state.mm.count).to.equal(0)
  })
})
