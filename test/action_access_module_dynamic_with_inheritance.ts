import Vue from 'vue'
import Vuex, { Module as Mod, Store } from 'vuex'
import { Action, Module, Mutation, VuexModule, getModule } from '../src'
import { expect } from 'chai'

Vue.use(Vuex)

const store = new Vuex.Store({})

class BaseModule extends VuexModule {
  fieldFoo = 'foo'
  fieldBar = 'bar'

  @Mutation
  setFooBase(value: string) {
    this.fieldFoo += value
  }

  @Mutation
  setBarBase(value: string) {
    this.fieldBar += value
  }

  @Action
  changeBarBase(value: string) {
    this.setBarBase(value)
  }
}

@Module({ dynamic: true, store, name: 'mm' })
class MyModule extends BaseModule {
  @Action
  changeFoo(value: string) {
    this.setFooBase(value)
  }

  @Action
  changeBar(value: string) {
    this.changeBarBase(value);
  }
}

describe('@Action with dynamic module with inheritance', () => {
  const mm = getModule(MyModule)

  it('changeFoo action call setFooBase mutation', async function() {
    await store.dispatch('changeFoo', 't1')
    expect(mm.fieldFoo).to.equal('foot1')
  })

  it('changeBar action call changeBarBase action', async function() {
    await store.dispatch('changeBar', 't1')
    expect(mm.fieldBar).to.equal('bart1')
  })
})
