import { Module as Mod } from 'vuex'

const reservedKeys = ['actions', 'getters', 'mutations', 'modules', 'state', 'namespaced', 'commit']
export function stateFactory<S>(module: Function & Mod<S, any>) {
  const state = new module.prototype.constructor({})
  const s = {} as S
  Object.keys(state).forEach((key: string) => {
    if (reservedKeys.indexOf(key) !== -1) {
      if (typeof state[key] !== 'undefined') {
        throw new Error(
          `ERR_RESERVED_STATE_KEY_USED: You cannot use the following
        ['actions', 'getters', 'mutations', 'modules', 'state', 'namespaced', 'commit']
        as fields in your module. These are reserved as they have special purpose in Vuex`
        )
      }
      return
    }
    if (state.hasOwnProperty(key)) {
      if (!(state[key] instanceof Function)) {
        ;(s as any)[key] = state[key]
      }
    }
  })

  return s
}
