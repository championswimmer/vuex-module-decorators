import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Action, Module, Mutation, VuexModule } from '..'
import { expect } from 'chai'

@Module({ namespaced: true })
class MyModule extends VuexModule {
    count = 100

    @Mutation
    setCount(count: number) {
        this.count = count;
    }


    @Action({ commit: 'setCount', root: true })
    reset() {
        return 0;
    }
}

const store = new Vuex.Store({
    modules: {
        mm: MyModule
    }
})

describe('root action works', () => {
    it('should set count to 0', async function() {
        await store.dispatch('reset')
        expect(parseInt(store.state.mm.count)).to.equal(0)
    })
})
