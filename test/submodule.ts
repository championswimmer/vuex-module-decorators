import Vuex, { Module as Mod } from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Action, Module, Mutation, MutationAction, VuexModule, Submodule, newStore } from '..'
import { expect } from 'chai'

@Module({ namespaced: true, stateFactory: true })
class MySubmodule extends VuexModule {
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
class MyModule extends VuexModule {
  @Submodule({ module: MySubmodule, namespaced: false })
  sub2!: MySubmodule

  @Submodule({ module: MySubmodule })
  sub1!: MySubmodule
}
const store = newStore(MyModule)

describe('submodule works', () => {
  it('should increase axles', function() {
    const module = store.getters.$statics as MyModule
    expect(module.sub1.axles).to.equal(1)
    expect(module.sub2.axles).to.equal(1)
    module.sub1.incrWheels(20)
    module.sub2.incrWheels(40)
    expect(module.sub1.axles).to.equal(11)
    expect(module.sub2.axles).to.equal(21)
  })
})