import {Module as Mod} from 'vuex'

export function stateFactory <S>(module: Function & Mod<S, any>) {
  const state = new (module.prototype.constructor)({})
  const s = <S>{}
  Object.keys(state).forEach((key: string) => {
    if (state.hasOwnProperty(key)) {
      if (typeof state[key] !== 'function') {
        (s as any)[key] = state[key]
      }
    }
  })

  return s
}