import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { getModule, Module, Action, Mutation, VuexModule } from '../..'
import { expect } from 'chai'

const store = new Vuex.Store({})

@Module({ name: 'mm', store, dynamic: true })
class MyModule extends VuexModule {
  public value = 10

  public get twofold(): number {
    return this.value * 2
  }
}

@Module({ name: 'mnm', store, dynamic: true, namespaced: true })
class MyNamespacedModule extends VuexModule {
  public value = 10

  public get twofold(): number {
    return this.value * 2
  }
}

describe('using getters on getModule()', () => {
  it('getter should return adjusted value', function() {
    expect(getModule(MyModule).value).to.equal(10)
    expect(getModule(MyModule).twofold).to.equal(20)
  })

  it('getter should return adjusted value on namespaced module', function() {
    expect(getModule(MyNamespacedModule).value).to.equal(10)
    expect(getModule(MyNamespacedModule).twofold).to.equal(20)
  })

  it('cannot reconfigure the getters', function () {
    expect(() => {
      Object.defineProperty(getModule(MyModule), 'twofold', {value: 'foo'})
    }).to.throw(TypeError, 'Cannot redefine property')
  })
})
