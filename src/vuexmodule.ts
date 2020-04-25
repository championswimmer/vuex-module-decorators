import {
  ActionTree,
  GetterTree,
  Module as Mod,
  ModuleTree,
  MutationTree,
  Store,
  ActionContext
} from 'vuex'
import { getModuleName, getModuleNamespace, getModulePath } from './helpers'
import { VuexStore } from './vuexstore'

export class VuexModule<S = ThisType<any>, R = any> {
  /*
   * To use with `extends Class` syntax along with decorators
   */
  static namespaced?: boolean
  static state?: any | (() => any)
  static getters?: GetterTree<any, any>
  static actions?: ActionTree<any, any>
  static mutations?: MutationTree<any>
  static modules?: ModuleTree<any>

  context!: ActionContext<S, R>

  static create<S>(module: Mod<S, any>) {
    return Object.assign({}, module) as typeof VuexModule
  }
}

type ConstructorOf<C> = {
  new (...args: any[]): C
  create<S>(module: Mod<S, any>): typeof VuexModule
}

export function getModule<M extends VuexModule>(
  moduleClass: ConstructorOf<M>,
  store?: Store<any>
): M {
  const moduleName = getModuleName(moduleClass)
  if (!store) {
    store = (moduleClass as any)._store
  }
  if (!store) {
    throw new Error(`ERR_STORE_NOT_PROVIDED: To use getModule(), either the module
      should be decorated with store in decorator, i.e. @Module({store: store}) or
      store should be passed when calling getModule(), i.e. getModule(MyModule, this.$store)`)
  }
  if (store && store.getters[moduleName]) {
    return store.getters[moduleName]
  }

  const storeModule = new VuexStore(
    moduleClass,
    store,
    getModulePath(moduleClass),
    getModuleNamespace(moduleClass)
  ).statics

  if (!store) {
    ;(moduleClass as any)._statics = storeModule
  }

  return storeModule
}
