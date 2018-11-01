import { Module as Mod, Mutation as Mut, Payload } from 'vuex'
import { VuexModule } from './vuexmodule'

export function Mutable<T, R>(
  target: T,
  key: string | symbol,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => R>
) {
  const module = target.constructor as Mod<T, any>
  if (!module.mutations) {
    module.mutations = {}
  }
  const mutation: Mut<typeof target> = function(state: typeof target, payload: Payload) {
    state['_' + (key as string)] = payload
  }

  module.mutations['auto:' + target.constructor.name + ':' + (key as string)] = mutation
}
