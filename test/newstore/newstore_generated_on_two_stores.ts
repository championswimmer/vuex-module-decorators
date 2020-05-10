import Vuex, { Module, Mutation } from '../..'
import { expect } from 'chai'

interface StoreType {
  mm: MyModule
}

@Module({ name: 'mm', stateFactory: true })
class MyModule extends Vuex.Module {
  count = 0

  @Mutation
  public incrCount() {
    ++this.count
  }
}

const firstStore = new Vuex.Store<StoreType>({
  modules: {
    mm: MyModule
  }
})

const secondStore = new Vuex.Store<StoreType>({
  modules: {
    mm: MyModule
  }
})

describe('modules generated on two different stores (new Store)', () => {
  it('should each have their own state', function() {
    const module = firstStore.getters.$statics.mm
    const secondModule = secondStore.getters.$statics.mm

    module.incrCount()
    expect(module.count).to.equal(1)
    expect(secondModule.count).to.equal(0)

    secondModule.incrCount()
    expect(module.count).to.equal(1)
    expect(secondModule.count).to.equal(1)
  })
})
