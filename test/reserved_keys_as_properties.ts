import { Module, VuexModule } from '..'
import { expect } from 'chai'

describe('prevent using reserved keys', () => {
  it('as module properties', function() {
    expect(() => {
      @Module
      class MyModule extends VuexModule {
        factory = undefined
        context: any = null
      }
    }).to.throw(/ERR_RESERVED_STATE_KEY_USED: .*/)
  })
})
