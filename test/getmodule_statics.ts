import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { getModule, Module, VuexModule } from '..'
import { expect } from 'chai'

@Module({ name: 'mm' })
class MyModule extends VuexModule {}

describe('getModule() without providing store', () => {
  it('should generate the module on statics property', function() {
    const module = getModule(MyModule)
    expect((MyModule as any)._statics).to.equal(module)
  })
})
