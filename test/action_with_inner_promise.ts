import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Action, Module, VuexModule } from '..'
import { expect } from 'chai'

@Module
class MyModule extends VuexModule {
  @Action
  public value() {
    return 'Test2'
  }

  @Action
  public promise() {
    return Promise.resolve('Test2')
  }
}

const store = new Vuex.Store({
  modules: {
    mm: MyModule
  }
})

describe('actions return inner promises', () => {
  it('should return resolved value', async function() {
    const value = await store.dispatch('value')
    expect(value).to.equal('Test2')
  })

  it('should return resolved promise', async function() {
    const value = await store.dispatch('promise')
    expect(value).to.equal('Test2')
  })
})
