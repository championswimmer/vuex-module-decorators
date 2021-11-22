import { config, Module, VuexModule, Action } from '..'
import { Store } from 'vuex'
import { expect } from 'chai'
import { ActionDecoratorParams } from '../src/action'

describe('Global config', function() {
  afterEach(function() {
    for (const key in config) {
      delete (config as any)[key]
    }
  })

  describe('rawError', function() {
    const WRAPPED_ERROR = 'ERR_ACTION_ACCESS_UNDEFINED'

    it('wraps errors by default', async function() {
      const store = buildStore()

      let error
      try {
        await store.dispatch('alwaysFail')
      } catch (e: any) {
        error = e
      }

      expect(error.message).to.contain(WRAPPED_ERROR)
    })

    it('unwraps errors when rawError is set globally', async function() {
      config.rawError = true
      const store = buildStore()

      let error
      try {
        await store.dispatch('alwaysFail')
      } catch (e: any) {
        error = e
      }

      expect(error.message).not.to.contain(WRAPPED_ERROR)
    })

    it('overrides the global config with @Action params', async function() {
      config.rawError = true
      const store = buildStore({ rawError: false })

      let error
      try {
        await store.dispatch('alwaysFail')
      } catch (e: any) {
        error = e
      }

      expect(error.message).to.contain(WRAPPED_ERROR)
    })
  })

  function buildStore(params: ActionDecoratorParams = {}) {
    @Module
    class MyModule extends VuexModule {
      @Action(params)
      async alwaysFail() {
        throw new Error('Foo Bar!')
      }
    }

    return new Store({
      modules: {
        mm: MyModule
      }
    })
  }
})
