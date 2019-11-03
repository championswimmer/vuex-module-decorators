import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { getModule, Module, VuexModule } from '..'
import { expect } from 'chai'

@Module
class MyModule extends VuexModule {}

describe('getModule() on unnamed module', () => {
  it('should error without name in decorator', function() {
    expect(() => getModule(MyModule)).to.throw(/ERR_GET_MODULE_NAME .*/)
  })
})
