import { ActionTree, GetterTree, Module as Mod, MutationTree } from 'vuex'
import { DynamicModuleOptions } from '../moduleoptions'

export function staticStateGenerator<S extends Object>(
  module: Function & Mod<S, any>,
  modOpt: DynamicModuleOptions,
  statics: any
) {
  const state: S = modOpt.stateFactory ? (module as any).state() : module.state
  Object.keys(state).forEach((key) => {
    if (state.hasOwnProperty(key)) {
      // If not undefined or function means it is a state value
      if (['undefined', 'function'].indexOf(typeof (state as any)[key]) === -1) {
        Object.defineProperty(statics, key, {
          get() {
            const path = modOpt.name.split('/')
            let data = statics.store.state
            for (let segment of path) {
              data = data[segment]
            }
            return data[key]
          }
        })
      }
    }
  })
}

export function staticGetterGenerator<S>(
  module: Function & Mod<S, any>,
  modOpt: DynamicModuleOptions,
  statics: any
) {
  Object.keys(module.getters as GetterTree<S, any>).forEach((key) => {
    const moduleKey = module.namespaced ? `${modOpt.name}/${key}` : key
    Object.defineProperty(statics, key, {
      configurable: !!modOpt.configurableGetters,
      get() {
        return statics.store.getters[moduleKey]
      }
    })
  })
}

export function staticMutationGenerator<S>(
  module: Function & Mod<S, any>,
  modOpt: DynamicModuleOptions,
  statics: any
) {
  Object.keys(module.mutations as MutationTree<S>).forEach((key) => {
    if (module.namespaced) {
      statics[key] = function (...args: any[]) {
        statics.store.commit(`${modOpt.name}/${key}`, ...args)
      }
    } else {
      statics[key] = function (...args: any[]) {
        statics.store.commit(key, ...args)
      }
    }
  })
}

export function staticActionGenerators<S>(
  module: Function & Mod<S, any>,
  modOpt: DynamicModuleOptions,
  statics: any
) {
  Object.keys(module.actions as ActionTree<S, any>).forEach((key) => {
    if (module.namespaced) {
      statics[key] = async function (...args: any[]) {
        return statics.store.dispatch(`${modOpt.name}/${key}`, ...args)
      }
    } else {
      statics[key] = async function (...args: any[]) {
        return statics.store.dispatch(key, ...args)
      }
    }
  })
}
