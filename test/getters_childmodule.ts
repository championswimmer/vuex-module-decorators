import Vuex, { Module as Mod } from 'vuex'
import { createApp } from 'vue'

import { Action, Module, Mutation, VuexModule } from '..'
import { expect } from 'chai'

class ParentModule extends VuexModule {
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

@Module
class ChildModule extends ParentModule {
  get axlesAndWheels() {
    return { axles: this.axles, axlesDouble: this.axlesDouble, wheels: this.wheels }
  }

  get axlesDouble() {
    return this.wheels
  }
}



const store = new Vuex.Store({
  state: {},
  modules: {
    mm: ChildModule
  }
})
const app = createApp({})
app.use(store)

describe('fetching via getters works', () => {

  it('should be able to access parent getter', async () => {
    await store.dispatch('incrWheelsAction', 2)
    const axles = store.getters.axles
    expect(axles).to.equal(2)
  })

  it('should be able to override axlesAndWheels', async function() {
    await store.dispatch('incrWheelsAction', 2)
    const axlesAndWheels = store.getters.axlesAndWheels
    expect(axlesAndWheels.axlesDouble).to.equal(6)
  })

})
