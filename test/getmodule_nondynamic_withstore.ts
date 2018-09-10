import Vuex, {Module as Mod} from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import {Action, getModule, Module, Mutation, MutationAction, VuexModule} from '../'
import {expect} from 'chai'

interface StoreType {
  mm: MyModule
}

@Module({name: 'mm'})
class MyModule extends VuexModule {
  count = 0

  @Mutation
  incrCount(delta: number) {
    this.count += delta
  }

  @Action({commit: 'incrCount'})
  async getCountDelta(retVal: number = 5) {
    return retVal
  }

  get halfCount () {
    return (this.count / 2).toPrecision(1)
  }

}

const store = new Vuex.Store<StoreType>({
  modules: {
    mm: MyModule
  }
})

describe('accessing statics fails on non-dynamic module', () => {
  it('should show error', function (done) {

    // const mm = getModule(MyModule, store)
    const mm = getModule(MyModule)
    expect(mm.count).to.equal(0)

    mm.incrCount(5)
    expect(mm.count).to.equal(5)
    expect(parseInt(mm.halfCount)).to.equal(3)

    mm.getCountDelta().then(() => {
      expect(parseInt(mm.halfCount)).to.equal(5)

      mm.getCountDelta(5).then(() => {
        expect(parseInt(mm.halfCount)).to.equal(8)
        done()
      }).catch(done)

    }).catch(done)


  })
})
