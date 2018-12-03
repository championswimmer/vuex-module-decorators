import { Module as Mod, Mutation as Mut, Payload } from 'vuex'

export function Mutable(target: any, key: string | symbol) {
  target.state['auto:' + (key as string)] = target.state[key] // TODO: Target task, not work
}
