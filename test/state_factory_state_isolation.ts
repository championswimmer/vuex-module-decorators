import Vuex, { Module as Mod } from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Action, Module, Mutation, MutationAction, VuexModule } from '..'
import { expect } from 'chai'

@Module({ stateFactory: true })
class FactoryModule extends VuexModule {
  wheels = 2

  @Mutation
  incrWheels(extra: number) {
    this.wheels += extra
  }

  get axles() {
    return this.wheels / 2
  }
}

@Module
class StateObjectModule extends VuexModule {
  wheels = 2

  @Mutation
  incrWheels(extra: number) {
    this.wheels += extra
  }

  get axles() {
    return this.wheels / 2
  }
}

const store = new Vuex.Store({
  modules: {
    factoryModA: FactoryModule,
    factoryModB: FactoryModule,
    objectModA: StateObjectModule,
    objectModB: StateObjectModule
  }
})

describe('state isolation', () => {
  it('should share state by default when reused', function() {
    store.commit('objectModA/incrWheels', 4)
    const axlesA = store.getters['objectModA/axles']
    const axlesB = store.getters['objectModB/axles']

    expect(axlesA).to.equal(3)
    expect(axlesB).to.equal(3)
  })
  it('should isolate state using factories when reused', function() {
    store.commit('factoryModA/incrWheels', 4)
    const axlesA = store.getters['factoryModA/axles']
    const axlesB = store.getters['factoryModB/axles']

    expect(axlesA).to.equal(3)
    expect(axlesB).to.equal(1)
  })
})
