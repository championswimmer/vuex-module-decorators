import {
  ActionTree,
  GetterTree,
  Module as Mod,
  ModuleTree,
  MutationTree,
  Store,
  ActionContext
} from 'vuex'
import { getModuleName } from './helpers'

export class VuexModule<S = ThisType<any>, R = any> implements Mod<S, R> {
  /*
   * To use with `extends Class` syntax along with decorators
   */
  static namespaced?: boolean
  static state?: any | (() => any)
  static getters?: GetterTree<any, any>
  static actions?: ActionTree<any, any>
  static mutations?: MutationTree<any>
  static modules?: ModuleTree<any>

  /*
   * To use with `new VuexModule(<ModuleOptions>{})` syntax
   */

  modules?: ModuleTree<any>
  namespaced?: boolean
  getters?: GetterTree<S, R>
  state?: S | (() => S)
  mutations?: MutationTree<S>
  actions?: ActionTree<S, R>
  context!: ActionContext<S, R>

  constructor(module: Mod<S, any>) {
    this.actions = module.actions
    this.mutations = module.mutations
    this.state = module.state
    this.getters = module.getters
    this.namespaced = module.namespaced
    this.modules = module.modules
  }
}
type ConstructorOf<C> = { new (...args: any[]): C }

export function getModule<M extends VuexModule>(
  moduleClass: ConstructorOf<M>,
  store?: Store<any>
): M {
  const moduleName = getModuleName(moduleClass)
  if (store && store.getters[moduleName]) {
    return store.getters[moduleName]
  } else if ((moduleClass as any)._statics) {
    return (moduleClass as any)._statics
  }

  const genStatic: (providedStore?: Store<any>) => M = (moduleClass as any)._genStatic
  if (!genStatic) {
    throw new Error(`ERR_GET_MODULE_NO_STATICS : Could not get module accessor.
      Make sure your module has name, we can't make accessors for unnamed modules
      i.e. @Module({ name: 'something' })`)
  }

  const storeModule = genStatic(store)

  if (store) {
    store.getters[moduleName] = storeModule
  } else {
    ;(moduleClass as any)._statics = storeModule
  }

  return storeModule
}
