import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { getModule, Module, Mutation, VuexModule } from '../..'
import { expect } from 'chai'
import { getModuleName } from '../../src/helpers'

interface StoreType {
  mm: MyModule
}

@Module({ name: 'mm', stateFactory: true })
class MyModule extends VuexModule {
  count = 0

  @Mutation
  public incrCount() {
    ++this.count
  }
}

const store = new Vuex.Store<StoreType>({
  modules: {
    mm: MyModule
  }
})

describe('module  generated on a single store', () => {
  it('should generate module in store getters', function() {
    const module = getModule(MyModule, store)
    expect(store.getters[getModuleName(MyModule)]).to.equal(module)
  })

  it('should retain state between getModule calls', function() {
    const module = getModule(MyModule, store)
    module.incrCount()
    expect(module.count).to.equal(1)

    const secondModule = getModule(MyModule, store)
    expect(secondModule.count).to.equal(1)

    secondModule.incrCount()
    expect(module.count).to.equal(2)
  })
})
