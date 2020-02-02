import { expect } from 'chai'
import 'mock-local-storage'
import Vue from 'vue'
import Vuex from 'vuex'
import { VuexPersistence } from 'vuex-persist'
import { Module, Mutation, VuexModule } from '..'
import { getModule } from '../src'

Vue.use(Vuex)

interface StoreType {
  mm: MyModule
}

localStorage.setItem(
  'vuex',
  JSON.stringify({
    mm: {
      count: 20
    }
  })
)

let vuexLocal = new VuexPersistence({
  storage: localStorage
})

let store = new Vuex.Store<StoreType>({
  plugins: [vuexLocal.plugin]
})

@Module({ dynamic: true, namespaced: true, store: store, name: 'mm', preserveState: localStorage.getItem('vuex') !== null })
class MyModule extends VuexModule {
  count = 0

  @Mutation
  incrCount(delta: number) {
    this.count += delta
  }
}

@Module({ dynamic: true, namespaced: true, store: store, name: 'msm' })
class MySecondModule extends VuexModule {
  count = 0

  @Mutation
  incrCount(delta: number) {
    this.count += delta
  }
}

describe('state restored by vuex-persist', () => {
  it('should restore state', function() {
    const mm = getModule(MyModule)
    mm.incrCount(5)
    expect(mm.count).to.equal(25)
    mm.incrCount(10)
    expect(mm.count).to.equal(35)

    const msm = getModule(MySecondModule)
    msm.incrCount(5)
    expect(msm.count).to.equal(5)
    msm.incrCount(10)
    expect(msm.count).to.equal(15)
  })
})
