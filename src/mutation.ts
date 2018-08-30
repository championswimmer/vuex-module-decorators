import {Module as Mod, Mutation as Mut, Payload} from 'vuex'

export function Mutation<T, R> (target: T, key: string | symbol, descriptor: TypedPropertyDescriptor<(...args: any[]) => R>) {
  const module = target.constructor as Mod<T,any>
  if (!module.mutations) {
    module.mutations = {}
  }
  const mutationFunction: Function = descriptor.value
  const mutation: Mut<typeof target> = function (state: typeof target, payload: Payload) {
    mutationFunction.call(state, payload)
  }
  module.mutations[<string>key] = mutation
}
