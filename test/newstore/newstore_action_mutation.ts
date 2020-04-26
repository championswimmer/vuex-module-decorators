import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Module, Action, Mutation, VuexModule, Submodule, newStore } from '../../'
import { expect } from 'chai'

const defaultValue = 10

@Module
class MySubModule extends VuexModule {
  public value = defaultValue

  @Mutation
  public setValue(value: number): void {
    this.value = value
  }

  @Action({ commit: 'setValue' })
  public async resetValue(): Promise<number> {
    return defaultValue
  }
}

@Module({ namespaced: true })
class MyNamespacedModule extends VuexModule {
  public value = defaultValue

  @Mutation
  public setValue(value: number): void {
    this.value = value
  }

  @Action({ commit: 'setValue' })
  public async resetValue(): Promise<number> {
    return defaultValue
  }
}

class MyModule extends VuexModule{
  @Submodule({ module: MySubModule })
  mm!: MySubModule

  @Submodule({ module: MyNamespacedModule })
  mnm!: MySubModule
}

const store = newStore(MyModule).getters.$statics as MyModule

describe('actions and mutations on getModule()', () => {
  it('mutation should set provided value', function() {
    const module = store.mm
    expect(module.value).to.equal(defaultValue)

    const newValue = defaultValue + 2
    module.setValue(newValue)
    expect(module.value).to.equal(newValue)
  })

  it('action should reset value to default', function() {
    const module = store.mm
    return module.resetValue().then(() => {
      expect(module.value).to.equal(defaultValue)
    })
  })

  it('mutation should set provided value on namespaced module', function() {
    const module = store.mnm
    expect(module.value).to.equal(defaultValue)

    const newValue = defaultValue + 2
    module.setValue(newValue)
    expect(module.value).to.equal(newValue)
  })

  it('action should reset value to default on namespaced module', function() {
    const module = store.mnm
    return module.resetValue().then(() => {
      expect(module.value).to.equal(defaultValue)
    })
  })
})
