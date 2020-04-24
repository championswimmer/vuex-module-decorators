import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { getModule, Module, VuexModule } from '../..'
import { expect } from 'chai'
import { getModuleName } from '../../src/helpers'

const store = new Vuex.Store({})

@Module({ name: 'mm', store })
class MyModule extends VuexModule {}

@Module({ name: 'mmws' })
class MyModuleWithoutStore extends VuexModule {}

describe('getModule() without providing store', () => {
  it('should generate the module on statics property', function() {
    const module = getModule(MyModule)
    expect(store.getters[getModuleName(MyModule)]).to.equal(module)
  })

  it('should error without defining store on the module', function() {
    expect(() => getModule(MyModuleWithoutStore)).to.throw(/ERR_STORE_NOT_PROVIDED.*/)
  })
})
