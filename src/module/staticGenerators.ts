import { VuexModule } from '../vuexmodule'
import { namespaced } from '../helpers'

export function staticStateGenerator<S extends Object>(module: VuexModule<S>, statics: any) {
  const stateFactory = module.$module?.state
  const state: S = typeof stateFactory === 'function' ? (stateFactory as any)() : stateFactory
  Object.keys(state).forEach((key) => {
    if (state.hasOwnProperty(key)) {
      // If not undefined or function means it is a state value
      if (['undefined', 'function'].indexOf(typeof (state as any)[key]) === -1) {
        Object.defineProperty(statics, key, {
          get(this: VuexModule) {
            return (module.context.state as any)[key]
          },
          enumerable: true
        })
      }
    }
  })
}

export function staticGetterGenerator<S>(module: VuexModule<S>, statics: any) {
  const getters = module.$module?.getters || {}
  Object.keys(getters).forEach((key) => {
    const namespacedKey = (getters[key] as any).root
      ? key
      : namespaced(module.context.namespace, key)
    Object.defineProperty(statics, key, {
      get() {
        return module.context.rootGetters[namespacedKey]
      },
      enumerable: true
    })
  })
}

export function staticMutationGenerator<S>(module: VuexModule<S>, statics: any) {
  const mutations = module.$module?.mutations || {}
  Object.keys(mutations).forEach((key) => {
    const namespacedKey = (mutations[key] as any).root
      ? key
      : namespaced(module.context.namespace, key)
    statics[key] = function(...args: any[]) {
      return module.context.context.commit(namespacedKey, ...args)
    }
  })
}

export function staticActionGenerators<S>(module: VuexModule<S>, statics: any) {
  const actions = module.$module?.actions || {}
  Object.keys(actions).forEach((key) => {
    const namespacedKey = (actions[key] as any).root
      ? key
      : namespaced(module.context.namespace, key)
    statics[key] = function(...args: any[]) {
      return module.context.context.dispatch(namespacedKey, ...args)
    }
  })
}
