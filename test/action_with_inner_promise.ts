import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Action, Module, MutationAction, VuexModule } from '..'
import { expect } from 'chai'

@Module({ namespaced: false })
class MyModule extends VuexModule {
  foo = ''

  @Action
  public value() {
    return 'Test1'
  }

  @Action
  public promise() {
    return Promise.resolve('Test2')
  }

  @MutationAction({ mutate: ['foo'], rawError: true })
  public promise2(payload: string) {
    return Promise.resolve({ foo: payload })
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
    expect(value).to.equal('Test1')
  })

  it('should return resolved promise', async function() {
    const value = await store.dispatch('promise')
    expect(value).to.equal('Test2')
  })

  it('should not return resolved promise on a MutationAction', async function() {
    // Purposefully not returning value from the action on a MutationAction because it is
    // designed to mutate the state and you should access the value off the state
    const {
      state: { mm }
    } = store
    let value = 'Test3'
    const resp = await store.dispatch('promise2', value)
    expect(resp).to.equal(void 0)
    expect(mm.foo).to.equal(value)
  })
})
