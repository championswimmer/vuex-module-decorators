import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Module, MutationAction, VuexModule } from '..'
import { expect } from 'chai'

@Module({ namespaced: true })
class MyModule extends VuexModule {
    count = 100


    @MutationAction({ mutate: ['count'], root: true })
    async reset() {
        return { count: 0 };
    }
}

const store = new Vuex.Store({
    modules: {
        mm: MyModule
    }
})

describe('root mutationaction works', () => {
    it('should set count to 0', async function() {
        await store.dispatch('reset')
        expect(parseInt(store.state.mm.count)).to.equal(0)
    })
})
