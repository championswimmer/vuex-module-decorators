import Vuex from 'vuex'
import { VuexModule } from '..'
import { expect } from 'chai'

const vehicle = VuexModule.create({
  state: {
    wheels: 2
  },
  mutations: {
    incrWheels(state, extra) {
      state.wheels += extra
    }
  },
  getters: {
    axles(state, rootState) {
      return state.wheels / 2
    }
  }
})

const store = new Vuex.Store({
  modules: {
    vehicle
  }
})

describe('new VuexModule() constuctor works', () => {
  it('should increase axles', function() {
    store.commit('incrWheels', 4)
    const axles = store.getters.axles
    expect(axles).to.equal(3)
  })
})
