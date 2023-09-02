import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Module, Mutation, VuexModule } from '..'
import { expect } from 'chai'

interface MyModule {
  count: number
}

@Module
class MyModule extends VuexModule {
  static namespaced = true

  static state() {
    return { count: 0 }
  }

  @Mutation
  incrCount(delta: number) {
    this.count += delta
  }
}

@Module
class NextModule extends MyModule {
  count = 2
  dogs = 1

  get num() {
    return this.count
  }
}

const store = new Vuex.Store({
  modules: {
    mm: NextModule
  }
})

describe("static module properties override", () => {
  it('should update static count', function() {
    store.commit('mm/incrCount', 5)
    expect(parseInt(store.state.mm.count)).to.equal(5)
  })
  it('should not add new field', function() {
    expect(store.state.mm.dogs).to.undefined
  })
  it('should add getter', function() {
    expect(store.getters['mm/num']).to.equal(5)
  })
})
