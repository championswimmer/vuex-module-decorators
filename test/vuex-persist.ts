import { expect } from 'chai'
import 'mock-local-storage'
import Vue from 'vue'
import { VuexPersistence } from 'vuex-persist'
import Vuex, { Module, Mutation } from '..'

Vue.use(Vuex)

interface StoreType {
  mm: MyModule
  msm: MySecondModule
}

localStorage.setItem(
  'vuex',
  JSON.stringify({
    mm: {
      count: 20
    }
  })
)

let vuexLocal = new VuexPersistence<StoreType>({
  storage: localStorage
})

let store = new Vuex.Store<StoreType>({
  plugins: [vuexLocal.plugin]
})

@Module({
  dynamic: true,
  namespaced: true,
  store: store,
  name: 'mm',
  preserveState: localStorage.getItem('vuex') !== null
})
class MyModule extends Vuex.Module {
  count = 0

  @Mutation
  incrCount(delta: number) {
    this.count += delta
  }
}

@Module({ dynamic: true, namespaced: true, store: store, name: 'msm' })
class MySecondModule extends Vuex.Module {
  count = 0

  @Mutation
  incrCount(delta: number) {
    this.count += delta
  }
}

describe('state restored by vuex-persist', () => {
  it('should restore state', function() {
    const mm = store.getters.$statics.mm;
    mm.incrCount(5)
    expect(mm.count).to.equal(25)
    mm.incrCount(10)
    expect(mm.count).to.equal(35)

    const msm = store.getters.$statics.msm;
    msm.incrCount(5)
    expect(msm.count).to.equal(5)
    msm.incrCount(10)
    expect(msm.count).to.equal(15)
  })
})
