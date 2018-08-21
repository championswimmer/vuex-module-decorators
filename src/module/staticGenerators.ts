import {Module as Mod} from 'vuex'
import {DynamicModuleOptions} from '../moduleoptions'


export function staticStateGenerator <S>(
  module: Function & Mod<S, any>,
  modOpt: DynamicModuleOptions,
  statics: any
) {
  Object.keys(module.state).forEach((key) => {
    if (module.state.hasOwnProperty(key)) {
      // If not undefined or function means it is a state value
      if (['undefined', 'function'].indexOf(typeof module.state[key]) === -1) {
        Object.defineProperty(statics, key, {
          get() {
            return modOpt.store.state[modOpt.name][key]
          }
        })
      }
    }
  })
}

export function staticGetterGenerator <S>(
  module: Function & Mod<S, any>,
  modOpt: DynamicModuleOptions,
  statics: any
) {
  Object.keys(module.getters).forEach((key) => {
    if (module.namespaced) {
      Object.defineProperty(statics, key, {
        get() {
          return modOpt.store.getters[`${modOpt.name}/${key}`]
        }
      })
    } else {
      Object.defineProperty(statics, key, {
        get() {
          return modOpt.store.getters[key]
        }
      })
    }
  })
}

export function staticMutationGenerator<S> (
  module: Function & Mod<S, any>,
  modOpt: DynamicModuleOptions,
  statics: any
) {
  Object.keys(module.mutations).forEach((key) => {
    if (module.namespaced) {
      statics[key] = function (...args: any[]) {
        modOpt.store.commit(`${modOpt.name}/${key}`, ...args)
      }
    } else {
      statics[key] = function (...args: any[]) {
        modOpt.store.commit(key, ...args)
      }
    }
  })
}

export function staticActionGenerators<S> (
  module: Function & Mod<S, any>,
  modOpt: DynamicModuleOptions,
  statics: any
) {
  Object.keys(module.actions).forEach((key) => {
    if (module.namespaced) {
      statics[key] = async function (...args) {
        return await modOpt.store.dispatch(`${modOpt.name}/${key}`, ...args)
      }
    } else {
      statics[key] = async function (...args) {
        return await modOpt.store.dispatch(key, ...args)
      }
    }
  })
}