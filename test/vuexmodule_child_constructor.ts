import Vuex from 'vuex'
import Vue from 'vue'
import { Module, Mutation, VuexModule } from '..'
import { expect } from 'chai'

Vue.use(Vuex)

@Module
class parentState extends VuexModule {
  wheels = 2

  @Mutation
  public incrWheels(extra: number) {
    this.wheels += extra
  }

  get axles() {
    return this.wheels / 2
  }
}

@Module
class childState extends parentState {
  seats = 4

  get space() {
    return this.seats
  }

  @Mutation
  public adjSpace(use: number) {
    this.seats += use
  }
}

@Module
class secondChild extends childState {
  additional = 'thing'

  get last() {
    return this.additional
  }

  @Mutation
  public setAddInfo(info: string){
    this.additional = info
  }
}

const store = new Vuex.Store({
  modules: {
    cs: secondChild
  }
})

describe('extend state constuctor works', () => {
  it('should increase axles', function() {
    store.commit('incrWheels', 4)
    const axles = store.getters.axles
    expect(axles).to.equal(3)
  })
  it('should return seat count', function() {
    store.commit('adjSpace', 2)
    const seats = store.getters.space
    expect(seats).to.equal(6)
  })
  it('should return additional state entry', function() {
    store.commit('setAddInfo', 'testing')
    const last = store.getters.last
    expect(last).to.equal('testing')
  })
})
