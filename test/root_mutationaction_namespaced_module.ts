import Vuex from 'vuex'
import { createApp } from 'vue'

import { Module, MutationAction, VuexModule } from '..'
import { expect } from 'chai'

@Module({ namespaced: true })
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
const app = createApp({})
app.use(store)

describe('root mutationaction works', () => {
    it('should set count to 0', async function() {
        await store.dispatch('setCount', 0)
        expect(parseInt(store.state.mm.count)).to.equal(0)
    })

    it('should not modify count', async function() {
        try {
            await store.dispatch('mm/setCount', 200)
        } catch (e: any) {
            expect(e).to.exist
        }
        expect(parseInt(store.state.mm.count)).to.equal(0)
    })
})
