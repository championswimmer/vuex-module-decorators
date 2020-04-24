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
import { VuexStore } from './vuexstore'

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
    return store.getters[moduleName].statics
  } else if ((moduleClass as any)._statics) {
    return (moduleClass as any)._statics
  }

  const storeWrapper = new VuexStore(moduleClass, store, moduleName)

  if (store) {
    store.getters[moduleName] = storeWrapper
  } else {
    ;(moduleClass as any)._statics = storeWrapper
  }

  return storeWrapper.statics
}
