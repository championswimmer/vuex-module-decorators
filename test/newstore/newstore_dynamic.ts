import Vuex, { Action, Module, Mutation } from '../..'
import { expect } from 'chai'

interface StoreType {
  mm: MyModule
}
const store = new Vuex.Store<StoreType>({})

@Module({ dynamic: true, store, name: 'mm' })
class MyModule extends Vuex.Module {
  count = 0

  @Mutation
  incrCount(delta: number) {
    this.count += delta
  }

  @Action({ commit: 'incrCount' })
  async getCountDelta(retVal: number = 5) {
    return retVal
  }

  get halfCount() {
    return (this.count / 2).toPrecision(1)
  }
}

describe('accessing statics works on dynamic module (new Store)', () => {
  it('should update count', async function() {
    const mm = (store.getters.$statics as StoreType).mm
    expect(mm.count).to.equal(0)

    mm.incrCount(5)
    expect(mm.count).to.equal(5)
    expect(parseInt(mm.halfCount)).to.equal(3)
    await mm.getCountDelta()
    expect(parseInt(mm.halfCount)).to.equal(5)
    await mm.getCountDelta(5)
    expect(parseInt(mm.halfCount)).to.equal(8)
  })
})
