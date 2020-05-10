import { VuexModule } from '../vuexmodule'
import { getNamespacedKey } from '../helpers'
import { Module, Store } from 'vuex'

export function staticStateGenerator<S extends Object, R>(
  statics: any,
  module: Module<S, R>,
  store: Store<any>,
  path: string[]
) {
  const stateFactory = module.state
  if (stateFactory === undefined) {
    return
  }
  const state = typeof stateFactory === 'function' ? (stateFactory as () => S)() : stateFactory
  const modules = module.modules || {}
  let contextedState: S
  Object.keys(state).forEach((key) => {
    if (state.hasOwnProperty(key) && !modules.hasOwnProperty(key)) {
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
  namespace?: string | null
) {
  const getters = module.getters || {}
  Object.keys(getters).forEach((key) => {
    const namespacedKey = getNamespacedKey(namespace, key)
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
  namespace?: string | null
) {
  const mutations = module.mutations || {}
  Object.keys(mutations).forEach((key) => {
    const namespacedKey = getNamespacedKey(namespace, key)
    statics[key] = function(...args: any[]) {
      return store.commit(namespacedKey, ...args)
    }
  })
}

export function staticActionGenerator<S, R>(
  statics: any,
  module: Module<S, R>,
  store: Store<R>,
  namespace?: string | null
) {
  const actions = module.actions || {}
  Object.keys(actions).forEach((key) => {
    const namespacedKey = (actions[key] as any).root ? key : getNamespacedKey(namespace, key)
    statics[key] = function(...args: any[]) {
      return store.dispatch(namespacedKey, ...args)
    }
  })
}

export function staticModuleGenerator<S, R>(
  module: Module<S, R>,
  store: Store<R>,
  path: string[] = [],
  namespace?: string | null,
  recursive: boolean = true
) {
  const statics = Object.create((module as Function).prototype || null)
  staticStateGenerator(statics, module, store, path)
  staticGetterGenerator(statics, module, store, namespace)
  staticMutationGenerator(statics, module, store, namespace)
  staticActionGenerator(statics, module, store, namespace)
  if (recursive) {
    const modules = module.modules || {}
    Object.keys(modules).forEach((key) => {
      const subModule = modules[key]
      // TODO: if not namespaced should statics be flatten?
      const subNamespace = subModule.namespaced ? getNamespacedKey(namespace, key) : namespace
      const subPath = path.concat(key)
      const subStaics = staticModuleGenerator(subModule, store, subPath, subNamespace, recursive)
      statics[key] = subStaics
    })
  }
  return statics as S
}
