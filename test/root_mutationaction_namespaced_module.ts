import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import { Module, MutationAction, VuexModule } from '..'
import { expect } from 'chai'

@Module
class MyModule extends VuexModule {
    count = 100

    @MutationAction({ mutate: ['count'], root: true, rawError: true })
    async setCount(count: number) {
        return { count }
    }
}

const store = new Vuex.Store({
    modules: {
        mm: MyModule
    }
})

describe('root mutationaction works', () => {
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
