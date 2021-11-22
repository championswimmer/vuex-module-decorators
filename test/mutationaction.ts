import Vuex from 'vuex'
import Vue from 'vue'
import { Module, MutationAction, VuexModule } from '..'
import { expect } from 'chai'

Vue.use(Vuex)

@Module
class MyModule extends VuexModule {
  count: number = 0
  anotherCount: number = 0
  fruit: string = 'Apple'
  vegetable: string | null = null


  @MutationAction({ mutate: ['count'] })
  async updateCount(newcount: number) {
    return { count: newcount }
  }

  @MutationAction
  async updateAnotherCountConditionally({ newCount, shouldUpdate }: { newCount: number, shouldUpdate: boolean }) {
    if (!shouldUpdate) return
    return { anotherCount: newCount }
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

  @MutationAction({ mutate: ['count'] })
  async incrementCount() {
    const newCount = this.count + 1
    console.log("==================")
    console.log("==================")
    console.log("==================")
    console.log(this)
    return { count: newCount }
  }
}

const store = new Vuex.Store({
  modules: {
    mm: MyModule
  }
})

describe('dispatching moduleaction works', () => {
  it('should update count', async function() {
    await store.dispatch('updateCount', 2)
    expect(parseInt(store.state.mm.count, 10)).to.equal(2)

    await store.dispatch('updateCountOnlyOnEven', 8)
    expect(parseInt(store.state.mm.count, 10)).to.equal(8)

    // try {
    //   await store.dispatch('updateCountButNoSuchPayload', '1337')
    // } catch (e: any) {
    //   expect(e.message).to.contain('ERR_MUTATE_PARAMS_NOT_IN_PAYLOAD')
    // }

    try {
      await store.dispatch('updateCountOnlyOnEven', 7)
    } catch (e: any) {
      expect(e.message).to.contain('not an even number')
    }
  })

  it('should update fruitname', async function() {
    await store.dispatch('changeFruit', 'Guava')
    expect(store.state.mm.fruit).to.equal('Guava')
  })

  it('should be able to skip update', async function () {
    expect(store.state.mm.anotherCount).to.equal(0)

    await store.dispatch('updateAnotherCountConditionally', { newCount: 5, shouldUpdate: true })
    expect(store.state.mm.anotherCount).to.equal(5)

    await store.dispatch('updateAnotherCountConditionally', { newCount: 10, shouldUpdate: false })
    expect(store.state.mm.anotherCount).to.equal(5)
  })
    
  it('can access state', async function() {
    await store.dispatch('updateCount', 0)
    expect(store.state.mm.count).to.equal(0)
    await store.dispatch('incrementCount')
    expect(store.state.mm.count).to.equal(1)
  })
})
