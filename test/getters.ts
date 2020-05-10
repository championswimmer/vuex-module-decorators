import Vuex, { Module as Mod } from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Action, Module, Mutation, VuexModule } from '..'
import { expect } from 'chai'

@Module({ namespaced: false })
class MyModule extends VuexModule {
  wheels = 2

  @Mutation
  incrWheels(extra: number) {
    this.wheels += extra
  }

  @Action({ rawError: true })
  async incrWheelsAction(payload: number) {
    const context = this.context
    this.context.commit('incrWheels', payload)
    const axles = this.context.getters.axles
    expect(this.context).to.equal(context)
    expect(this.axles).to.equal(axles)
  }

  get axles() {
    return this.wheels / 2
  }
  get axlesAndWheels() {
    return { axles: this.axles, wheels: this.wheels }
  }
}

const store = new Vuex.Store({
  state: {},
  modules: {
    mm: MyModule
  }
})

describe('fetching via getters works', () => {
  it('should not override the context in the action', async () => {
    await store.dispatch('incrWheelsAction', 2)
    const axles = store.getters.axles
    expect(axles).to.equal(2)
  })
  it('should increase axles', function() {
    store.commit('incrWheels', 2)
    const axles = store.getters.axles
    expect(axles).to.equal(3)
  })
  it(`should be able to access a getter within a getter with this['key']`, async () => {
    const axlesAndWheels = store.getters.axlesAndWheels
    expect(axlesAndWheels.axles).to.equal(3)
  })
})
