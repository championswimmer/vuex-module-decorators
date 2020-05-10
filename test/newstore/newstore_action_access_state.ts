import Vuex, { Action, Module, Mutation } from '../..'
import { expect } from 'chai'

@Module
class MyModule extends Vuex.Module {
  fieldFoo = 'foo'
  fieldBar = 'bar'

  @Mutation
  resetFoo() {
    this.fieldFoo = 'foo'
  }
  @Mutation
  resetBar() {
    this.fieldBar = 'bar'
  }
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
  @Action({ rawError: true })
  async testStateInAction(payload: string) {
    this.context.commit('setFoo', payload)
    expect((this.context.state as any).fieldFoo).to.equal('foo' + payload)
    expect(this.fieldFoo).to.equal('foo' + payload)
  }

  @Action({ rawError: true })
  async alwaysFail() {
    throw Error('Foo Bar!')
  }
}

const store = new Vuex.Store<any>({
  modules: {
    mm: MyModule
  }
})

describe('@Action with non-dynamic module (new Vuex.Store)', () => {
  const mm = store.getters.$statics.mm as MyModule
  it('should concat foo & bar', async function() {
    await store.dispatch('mm/concatFooOrBar', 't1')
    expect(mm.fieldBar).to.equal('bart1')
    await mm.concatFooOrBar('t1')
    expect(mm.fieldFoo).to.equal('foot1')
  })
  it('should success if this.mutation() is used in non-dynamic', async function() {
    mm.resetFoo()
    await mm.concatFooOrBarWithThis('t2')
    expect(mm.fieldFoo).to.equal('foot2')
  })
  it('should save original error', async function() {
    try {
      await mm.alwaysFail()
    } catch (e) {
      expect(e.message).to.equal('Foo Bar!')
    }
  })
  it('should have access to the state even if the state changes', async function() {
    mm.resetFoo()
    expect(mm.fieldFoo).to.equal('foo')
    await mm.testStateInAction('bar')
    expect(mm.fieldFoo).to.equal('foobar')
  })
})
