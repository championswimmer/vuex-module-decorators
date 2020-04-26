import Vuex, { Module as Mod, Store } from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Action, Module, Mutation, VuexModule, newStore, Context } from '..'
import { expect } from 'chai'

const store = newStore<any>({})

@Module({ dynamic: true, store, name: 'mm', namespaced: true })
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
      this.setFoo(newstr)
    } else {
      this.setBar(newstr)
    }
  }

  get fooEqBar() {
    return this.fieldFoo == this.fieldBar
  }
}

describe('@Action with dynamic module (Context)', () => {
  it('should concat foo & bar', async function() {
    const context = new Context(store, ['mm'], 'mm')
    await context.dispatch('concatFooOrBar', 't1')
    expect(context.state.fieldBar).to.equal('bart1')
    context.commit('setFoo', 'bar')
    await context.dispatch('concatFooOrBar', 't1')
    expect(context.getter('fooEqBar')).to.equal(false)
    expect(context.state.fieldFoo).to.equal('foobar')
  })
})
