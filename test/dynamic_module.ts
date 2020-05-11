import Vue from 'vue'
import Vuex, { Action, Module, Mutation, VuexModule } from '..'
Vue.use(Vuex)
import { expect } from 'chai'

interface StoreType {
  namespaced: {
    nested: {
      mm: MyModule
    }
  }
}
const store = new Vuex.Store<StoreType>({
  modules: {
    namespaced: {
      namespaced: true,
      modules: {
        nested: {}
      }
    }
  }
})

@Module({ dynamic: true, store, name: 'namespaced.nested.mm', namespaced: false })
class MyModule extends VuexModule {
  count = 0

  @Mutation
  incrCount(delta: number) {
    this.count += delta
  }
}

describe('mutation works on dynamic module', () => {
  it('should update count', function() {
    store.commit('namespaced/incrCount', 5)
    expect(store.state.namespaced.nested.mm.count).to.equal(5)
    store.getters.$statics.namespaced.nested.mm.incrCount(5)
    expect(store.getters.$statics.namespaced.nested.mm.count).to.equal(10)
  })
})

describe('dynamic module', () => {
  it('should error without store in decorator', function() {
    expect(() => {
      @Module({ name: 'mm', dynamic: true })
      class MyModule extends VuexModule {}
    }).to.throw('Store not provided in decorator options when using dynamic option')
  })

  it('should error when path not exists in decorator', function() {
    expect(() => {
      @Module({ name: 'path_not_exists.mm', store, dynamic: true })
      class MyModule extends VuexModule {}
    }).to.throw('ERR_DYNAMIC_MODULE_NOT_EXISTS')
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
