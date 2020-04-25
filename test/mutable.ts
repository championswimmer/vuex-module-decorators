import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Module, VuexModule, Mutable } from '..'
import { expect } from 'chai'

@Module
class MyModule extends VuexModule {
  @Mutable
  field = 5
}

const store = new Vuex.Store({
  modules: {
    mm: MyModule
  }
})

describe('mutable initialization works', () => {
  it('should add mutable annotation', function() {
    expect(Object.keys(store.state.mm).indexOf('auto:field')).not.equal(-1)
  })
})
