import Vuex, { Module as Mod, ModuleTree } from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Action, Module, Mutation, MutationAction, VuexModule } from '..'
import { expect } from 'chai'

interface StoreType {
  mm: MyModule
}
const store = new Vuex.Store<StoreType>({
  modules: {
    mm: {
      state: {
        count: 5
      }
    }
  } as ModuleTree<any>
})

@Module({ dynamic: true, store, name: 'mm', preserveState: true })
class MyModule extends VuexModule {
  count = 0
  initial = 0
}

describe('dynamic module with preserve data and initialized initial state', () => {
  it('should preserve count to 5', function() {
    expect(store.state.mm.count).to.equal(5)
  })
  it('should initialize initial variable to 0', function() {
    expect(store.state.mm.initial).to.equal(0)
  })
})
