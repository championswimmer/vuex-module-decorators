import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { getModule, Module, VuexModule } from '../..'
import { expect } from 'chai'

const store = new Vuex.Store({})

@Module({ name: 'mm', store, dynamic: true, configurableGetters: true })
class DynamicModule extends VuexModule {
  public value = 10

  public get twofold(): number {
    return this.value * 2
  }
}

@Module({name: 'mm', store, configurableGetters: true})
class StaticModule extends VuexModule {
  public value = 10

  public get twofold(): number {
    return this.value * 2
  }
}

describe('using getters on dynamic getModule()', () => {
  it('getter should return adjusted value', function() {
    expect(getModule(DynamicModule).value).to.equal(10)
    expect(getModule(DynamicModule).twofold).to.equal(20)
  })

  it('can reconfigure the getters', function () {
    Object.defineProperty(getModule(DynamicModule), 'twofold', {value: 'foo'})
    expect(getModule(DynamicModule).twofold).to.equal('foo');
  })
})

describe('using getters on static getModule()', () => {
  it('getter should return adjusted value', function () {
    expect(getModule(StaticModule).value).to.equal(10)
    expect(getModule(StaticModule).twofold).to.equal(20)
  })

  it('can reconfigure the getters', function () {
    Object.defineProperty(getModule(StaticModule), 'twofold', {value: 'foo'})
    expect(getModule(StaticModule).twofold).to.equal('foo');
  })
})
