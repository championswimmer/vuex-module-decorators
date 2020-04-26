import Vuex, { Module as Mod, Store } from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Action, Module, Mutation, VuexModule, newStore, Context } from '..'
import { expect } from 'chai'

const store = newStore<any>({})

@Module({ dynamic: true, store, name: 'mm', namespaced: true, stateFactory: true })
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
  async concatFooOrBar(payload: { newstr: string }) {
    if (this.fieldFoo.length < this.fieldBar.length) {
      this.setFoo(payload.newstr)
    } else {
      this.setBar(payload.newstr)
    }
  }

  get fooEqBar() {
    return this.fieldFoo == this.fieldBar
  }
}

describe('@Action with dynamic module (Context)', () => {
  it('should concat foo & bar (namespaced)', async function() {
    const context = new Context(store, ['mm'], 'mm')
    await context.dispatch('concatFooOrBar', { newstr: 't1' })
    expect(context.state.fieldBar).to.equal('bart1')
    context.commit('setFoo', 'bar')
    await context.dispatch({ type: 'concatFooOrBar', newstr: 't1' })
    expect(context.getter('fooEqBar')).to.equal(false)
    expect(context.state.fieldFoo).to.equal('foobar')
  })

  it('should concat foo & bar', async function() {
    const store = newStore(MyModule)
    const context = new Context(store)
    await context.dispatch('concatFooOrBar', { newstr: 't1' })
    expect(context.state.fieldBar).to.equal('bart1')
    context.commit('setFoo', 'bar')
    await context.dispatch({ type: 'concatFooOrBar', newstr: 't1' })
    expect(context.getter('fooEqBar')).to.equal(false)
    expect(context.state.fieldFoo).to.equal('foobar')
  })
})
