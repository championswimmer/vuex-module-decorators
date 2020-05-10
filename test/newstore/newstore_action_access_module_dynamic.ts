import Vuex, { Action, Module, Mutation } from '../..'
import { expect } from 'chai'

const store = new Vuex.Store<any>({})

@Module({ dynamic: true, store, name: 'mm' })
class MyModule extends Vuex.Module {
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
}

describe('@Action with dynamic module (new Store)', () => {
  it('should concat foo & bar', async function() {
    const mm = store.getters.$statics.mm as MyModule
    await mm.concatFooOrBar('t1')
    expect(mm.fieldBar).to.equal('bart1')
    await store.dispatch('concatFooOrBar', 't1')
    expect(mm.fieldFoo).to.equal('foot1')
  })
})
