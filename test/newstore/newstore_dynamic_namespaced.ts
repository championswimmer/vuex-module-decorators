import Vuex, { Module as Mod } from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Action, Module, Mutation, MutationAction, VuexModule, newStore } from '../..'
import { expect } from 'chai'

interface StoreType {
  mm: MyModule
}
const store = newStore<StoreType>({})

@Module({ dynamic: true, store, name: 'mm', namespaced: true })
class MyModule extends VuexModule {
  count = 0

  @Mutation
  incrCount(delta: number) {
    this.count += delta
  }

  @Action({ commit: 'incrCount' })
  async getCountDelta(retVal: number = 5) {
    return retVal
  }

  @Action({ commit: 'incrCount', root: true })
  async getCountDeltaRoot(retVal: number = 7) {
    return retVal
  }

  get halfCount() {
    return (this.count / 2).toPrecision(1)
  }
}

describe('accessing statics works on dynamic namespaced module (newStore)', () => {
  it('should update count', async function() {
    const mm = store.getters.$statics.mm
    expect(mm.count).to.equal(0)

    mm.incrCount(5)
    expect(mm.count).to.equal(5)
    expect(parseInt(mm.halfCount)).to.equal(3)

    await mm.getCountDelta()
    expect(parseInt(mm.halfCount)).to.equal(5)
    await mm.getCountDelta(5)
    expect(parseInt(mm.halfCount)).to.equal(8)
    await mm.getCountDeltaRoot()
    expect(parseInt(mm.halfCount)).to.equal(1)
  })
})