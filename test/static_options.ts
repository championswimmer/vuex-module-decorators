import Vuex, { Action, Module, Mutation } from '..'
import { expect } from 'chai'

interface MyModule {
  count: number
}

@Module
class MyModule extends Vuex.Module {
  static namespaced = true

  static state () {
    return { count: 0 }
  }

  @Mutation
  incrCount(delta: number) {
    this.count += delta
  }
}

describe('static module statics work', () => {
  it('should update count', function() {
    const store = new Vuex.Store<any>({
      modules: {
        mm: MyModule
      }
    })
    store.getters.$statics.mm.incrCount(5)
    expect(parseInt(store.state.mm.count)).to.equal(5)
  })
})

describe('static root module statics work', () => {
  it('should update count', function() {
    const store = new Vuex.Store(MyModule)
    store.getters.$statics.incrCount(5)
    expect(store.state.count).to.equal(5)
  })
})

const store = new Vuex.Store({
  modules: {
    mm: MyModule
  }
})

describe('static module properties work', () => {
  it('should update count', function() {
    store.commit('mm/incrCount', 5)
    expect(parseInt(store.state.mm.count)).to.equal(5)
  })
})
