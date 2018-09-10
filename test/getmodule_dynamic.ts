import Vuex, {Module as Mod} from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import {Action, getModule, Module, Mutation, MutationAction, VuexModule} from '../'
import {expect} from 'chai'

interface StoreType {
  mm: MyModule
}
const store = new Vuex.Store<StoreType>({
})

@Module({dynamic: true, store: store, name: 'mm'})
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



describe('accessing statics works on dynamic module', () => {
  it('should update count', function (done) {

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
