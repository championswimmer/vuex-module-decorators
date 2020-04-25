import Vuex, { Module as Mod } from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Action, Module, Mutation, MutationAction, VuexModule } from '..'
import { expect } from 'chai'

describe('prevent using reserved keys', () => {
  it('as module properties', function() {
    expect(() => {
      @Module
      class MyModule extends VuexModule {
        context: any = null
      }
    }).to.throw(/ERR_RESERVED_STATE_KEY_USED: .*/)
  })
})
