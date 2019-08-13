import { Module as Mod, Mutation as Mut, Payload } from 'vuex'

export function Mutation<T extends Object, R>(
  target: T,
  key: string | symbol,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => R>
) {
  const module = target.constructor as Mod<T, any>
  if (!module.mutations) {
    module.mutations = {}
  }
  const mutationFunction: Function = descriptor.value ? descriptor.value : (...args: any[]) => ({})
  const mutation: Mut<typeof target> = function(state: typeof target, payload: Payload) {
    mutationFunction.call(state, payload)
  }
  module.mutations[key as string] = mutation
}
