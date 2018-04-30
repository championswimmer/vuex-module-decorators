import {Module as Mod, Mutation as Mut, Payload} from 'vuex'

export function Mutation<T> (target: T, key: string | symbol, descriptor: TypedPropertyDescriptor<Function>) {
  const module = target.constructor as Mod<T,any>
  if (!module.mutations) {
    module.mutations = {}
  }
  const mutationFunction: Function = descriptor.value
  const mutation: Mut<typeof target> = function (state: typeof target, payload: Payload) {
    mutationFunction.call(state, [payload])
  }
  module.mutations[key] = mutation
}