import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import { Module, MutationAction, VuexModule } from '..'
import { expect } from 'chai'

@Module
class MyModule extends VuexModule {
  count: number = 0
  fruit: string = 'Apple'
  vegetable: string | null = null


  @MutationAction({ mutate: ['count'] })
  async updateCount(newcount: number) {
    return { count: newcount }
  }

  @MutationAction
  async changeVeggie() {
    return {vegetable: 'Carrot'}
  }

  @MutationAction
  async changeFruit(fruitName: string) {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {fruit: fruitName || 'Guava'}
  }

  // Newer more type-safe 'mutate' param removes need for this test
  // @MutationAction({ mutate: ['definitelyNotCount'], rawError: true })
  // async updateCountButNoSuchPayload(newcount: number) {
  //   return { definitelyNotCount: newcount }
  // }

  @MutationAction({ mutate: ['count'], rawError: true })
  async updateCountOnlyOnEven(newcount: number) {
    if (newcount % 2 !== 0) {
      throw new Error('The number provided is not an even number')
    }

    return {count: newcount}
  }
}

const store = new Vuex.Store(MyModule)

describe('dispatching moduleaction works', () => {
  it('should update count', async function() {
    await store.dispatch('updateCount', 2)
    expect(parseInt(store.state.count, 10)).to.equal(2)

    await store.dispatch('updateCountOnlyOnEven', 8)
    expect(parseInt(store.state.count, 10)).to.equal(8)

    // try {
    //   await store.dispatch('updateCountButNoSuchPayload', '1337')
    // } catch (e) {
    //   expect(e.message).to.contain('ERR_MUTATE_PARAMS_NOT_IN_PAYLOAD')
    // }

    try {
      await store.dispatch('updateCountOnlyOnEven', 7)
    } catch (e) {
      expect(e.message).to.contain('not an even number')
    }
  })

  it('should update fruitname', async function() {
    await store.dispatch('changeFruit', 'Guava')
    expect(store.state.fruit).to.equal('Guava')
  })
})
