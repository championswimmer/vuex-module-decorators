import Vuex, { Module as Mod, Store } from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Action, Module, Mutation, MutationAction, VuexModule } from '..'
import { expect } from 'chai'

@Module
class MyModule extends VuexModule {
  fieldFoo = 'foo'
  fieldBar = 'bar'

  @Mutation
  setFoo(data: string) {
    this.fieldFoo += data
  }
  @Mutation
  setBar(data: string) {
    this.fieldBar += data
  }

  @Action
  async concatFooOrBar(newstr: string) {
    if (this.fieldFoo.length < this.fieldBar.length) {
      this.context.commit('setFoo', newstr)
    } else {
      this.context.commit('setBar', newstr)
    }
  }
  @Action
  async concatFooOrBarWithThis(newstr: string) {
    if (this.fieldFoo.length < this.fieldBar.length) {
      this.setFoo(newstr)
    } else {
      this.setBar(newstr)
    }
  }

  @Action({ throwOriginalError: true })
  async alwaysFail() {
    throw Error('Foo Bar!')
  }
}

const store = new Vuex.Store({
  modules: {
    mm: MyModule
  }
})

describe('@Action with non-dynamic module', () => {
  it('should concat foo & bar (promise)', function(done) {
    store
      .dispatch('concatFooOrBar', 't1')
      .then(() => {
        expect(store.state.mm.fieldBar).to.equal('bart1')
      })
      .then(() => {
        store.dispatch('concatFooOrBar', 't1').then(() => {
          expect(store.state.mm.fieldFoo).to.equal('foot1')
        })
        done()
      })
      .catch(done)
  })

  it('should concat foo & bar (await)', async function() {
    await store.dispatch('concatFooOrBar', 't1')
    expect(store.state.mm.fieldBar).to.equal('bart1t1')
    await store.dispatch('concatFooOrBar', 't1')
    expect(store.state.mm.fieldFoo).to.equal('foot1t1')
  })
  it('should error if this.mutation() is used in non-dynamic', async function() {
    try {
      await store.dispatch('concatFooOrBarWithThis', 't1')
    } catch (e) {
      expect(e.message).to.contain('ERR_ACTION_ACCESS_UNDEFINED')
    }
  })
  it('should save original error', async function() {
    try {
      await store.dispatch('alwaysFail')
    } catch (e) {
      expect(e.message).to.equal('Foo Bar!')
    }
  })
})
