import { VuexModule } from '../vuexmodule'
import { namespaced } from '../helpers'
import { Module, Store } from 'vuex'

export function staticStateGenerator<S extends Object, R>(
  statics: any,
  module: Module<S, R>,
  store: Store<any>,
  path: string[] = []
) {
  const stateFactory = module.state
  if (stateFactory === undefined) {
    return
  }
  const state = typeof stateFactory === 'function' ? (stateFactory as () => S)() : stateFactory
  let contextedState: S
  Object.keys(state).forEach((key) => {
    if (state.hasOwnProperty(key)) {
      // If not undefined or function means it is a state value
      if (['undefined', 'function'].indexOf(typeof (state as any)[key]) === -1) {
        Object.defineProperty(statics, key, {
          get(this: VuexModule) {
            if (contextedState === undefined) {
              contextedState = path.reduce((state, key) => state[key], store.state)
            }
            return (contextedState as any)[key]
          },
          enumerable: true
        })
      }
    }
  })
}

export function staticGetterGenerator<S, R>(
  statics: any,
  module: Module<S, R>,
  store: Store<R>,
  namespace?: string
) {
  const getters = module.getters || {}
  Object.keys(getters).forEach((key) => {
    const namespacedKey = (getters[key] as any).root ? key : namespaced(namespace, key)
    Object.defineProperty(statics, key, {
      get() {
        return store.getters[namespacedKey]
      },
      enumerable: true
    })
  })
}

export function staticMutationGenerator<S, R>(
  statics: any,
  module: Module<S, R>,
  store: Store<R>,
  namespace?: string
) {
  const mutations = module.mutations || {}
  Object.keys(mutations).forEach((key) => {
    const namespacedKey = (mutations[key] as any).root ? key : namespaced(namespace, key)
    statics[key] = function(...args: any[]) {
      return store.commit(namespacedKey, ...args)
    }
  })
}

export function staticActionGenerators<S, R>(
  statics: any,
  module: Module<S, R>,
  store: Store<R>,
  namespace?: string
) {
  const actions = module.actions || {}
  Object.keys(actions).forEach((key) => {
    const namespacedKey = (actions[key] as any).root ? key : namespaced(namespace, key)
    statics[key] = function(...args: any[]) {
      return store.dispatch(namespacedKey, ...args)
    }
  })
}

export function staticModuleGenerators<S, R>(
  module: Module<S, R>,
  store: Store<R>,
  path: string[] = [],
  namespace?: string
) {
  const statics = Object.create(null)
  staticStateGenerator(statics, module, store, path)
  staticGetterGenerator(statics, module, store, namespace)
  staticMutationGenerator(statics, module, store, namespace)
  staticActionGenerators(statics, module, store, namespace)
  return statics as S
}
