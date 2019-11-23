import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Action, Module, Mutation, VuexModule } from '..'
import { expect } from 'chai'

@Module({ namespaced: true })
class MyModule extends VuexModule {
    count = 100

    @Mutation
    modifyCount(count: number) {
        this.count = count
    }


    @Action({ commit: 'modifyCount', root: true, rawError: true })
    async setCount(count: number) {
        return count
    }
}

const store = new Vuex.Store({
    modules: {
        mm: MyModule
    }
})

describe('root action works', () => {
    it('should set count to 0', async function() {
        await store.dispatch('setCount', 0)
        expect(parseInt(store.state.mm.count)).to.equal(0)
    })

    it('should not modify count', async function() {
        try {
            await store.dispatch('mm/setCount', 200)
        } catch (e) {
            expect(e).to.exist
        }
        expect(parseInt(store.state.mm.count)).to.equal(0)
    })
})
