import Vuex, { Module as Mod } from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Action, Module, Mutation, MutationAction, VuexModule } from '..'
import { VuexPersistence, MockStorage } from 'vuex-persist'
import { expect } from 'chai'

interface StoreType {
  mm: MyModule
}

const mockStorage = new MockStorage()
mockStorage.setItem(
  'vuex',
  JSON.stringify({
    mm: {
      count: 5
    }
  })
)

let vuexLocal = new VuexPersistence({
  storage: mockStorage
})

let store = new Vuex.Store<StoreType>({
  plugins: [vuexLocal.plugin]
})

@Module({ dynamic: true, store: store, name: 'mm' })
class MyModule extends VuexModule {
  count = 0

  @Mutation
  incrCount(delta: number) {
    this.count += delta
  }
}

describe('state restored  by vuex-persist', () => {
  it('should restore state', function() {
    store.commit('incrCount', 5)
    expect(store.state.mm.count).to.equal(10)
  })
})
