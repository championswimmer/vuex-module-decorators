import Vuex from 'vuex'
import { createApp } from 'vue'

import { getModule, Module, Action, Mutation, VuexModule } from '../../'
import { expect } from 'chai'

const store = new Vuex.Store({})

const defaultValue = 10

@Module({ name: 'mm', store, dynamic: true })
class MyModule extends VuexModule {
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

@Module({ name: 'mnm', store, dynamic: true, namespaced: true })
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

describe('actions and mutations on getModule()', () => {
  it('mutation should set provided value', function() {
    const module = getModule(MyModule)
    expect(module.value).to.equal(defaultValue)

    const newValue = defaultValue + 2
    module.setValue(newValue)
    expect(module.value).to.equal(newValue)
  })

  it('action should reset value to default', function() {
    const module = getModule(MyModule)
    return module.resetValue().then(() => {
      expect(module.value).to.equal(defaultValue)
    })
  })

  it('mutation should set provided value on namespaced module', function() {
    const module = getModule(MyNamespacedModule)
    expect(module.value).to.equal(defaultValue)

    const newValue = defaultValue + 2
    module.setValue(newValue)
    expect(module.value).to.equal(newValue)
  })

  it('action should reset value to default on namespaced module', function() {
    const module = getModule(MyNamespacedModule)
    return module.resetValue().then(() => {
      expect(module.value).to.equal(defaultValue)
    })
  })
})
