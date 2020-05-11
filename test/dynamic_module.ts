import Vuex from 'vuex'
import { Action, Module, Mutation, VuexModule } from '..'
import { expect } from 'chai'

interface StoreType {
  mm: MyModule
}
const store = new Vuex.Store<StoreType>({})

@Module({ dynamic: true, store, name: 'mm', namespaced: false })
class MyModule extends VuexModule {
  count = 0

  @Mutation
  incrCount(delta: number) {
    this.count += delta
  }
}

describe('mutation works on dynamic module', () => {
  it('should update count', function() {
    store.commit('incrCount', 5)
    expect(store.state.mm.count).to.equal(5)
  })
})

describe('dynamic module', () => {
  it('should error without store in decorator', function() {
    expect(() => {
      @Module({ name: 'mm', dynamic: true })
      class MyModule extends VuexModule {}
    }).to.throw('Store not provided in decorator options when using dynamic option')
  })

  it('should error without name in decorator', function() {
    expect(() => {
      const store = new Vuex.Store({})

      // Ignore the TS error when module options are missing required name property
      // @ts-ignore
      @Module({
        store,
        dynamic: true
      })
      class MyDynamicModule extends VuexModule {}
    }).to.throw('Name of module not provided in decorator options')
  })
})
