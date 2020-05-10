import { expect } from 'chai'
import 'mock-local-storage'
import Vue from 'vue'
import { VuexPersistence } from 'vuex-persist'
import Vuex, { Module, Mutation, VuexModule, newStore } from '..'

declare module "vue/types/vue" {
  interface Vue {
    $stock: StoreType
  }
}

interface StoreType {
  mm: MyModule
  msm?: MySecondModule
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

let store = newStore<StoreType>({
  plugins: [vuexLocal.plugin]
})

@Module({
  dynamic: true,
  namespaced: true,
  store: store,
  name: 'mm',
  preserveState: localStorage.getItem('vuex') !== null
})
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


describe('state access by $stock', () => {
  it('should restore state', function() {
    Vue.use(Vuex)
    const vue = new Vue({ store })
    const mm = vue.$stock.mm
    mm.incrCount(5)
    expect(mm.count).to.equal(25)
    mm.incrCount(10)
    expect(mm.count).to.equal(35)

    const msm = vue.$stock.msm!
    msm.incrCount(5)
    expect(msm.count).to.equal(5)
    msm.incrCount(10)
    expect(msm.count).to.equal(15)
  })
})
