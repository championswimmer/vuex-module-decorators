import {
  ActionTree,
  GetterTree,
  Module as Mod,
  ModuleTree,
  MutationTree,
  Store,
  ActionContext,
  Payload,
  StoreOptions
} from 'vuex'
import { getStaticName, getNamespacedKey } from './helpers'
import { staticModuleGenerator } from './module/staticGenerators'

export class Context<S, R = any> implements ActionContext<S, R> {
  namespace?: string
  path!: string[]
  context!: Store<S> | ActionContext<S, R>
  state!: S
  rootState!: R
  getters: any // not implemented
  rootGetters: any
  namespaced<P extends Payload>(key: string | P) {
    if (!this.namespace) {
      return key
    }
    if (typeof key === 'string') {
      return `${this.namespace}/${key}`
    } else {
      key.type = `${this.namespace}/${key.type}`
      return key
    }
  }
  getter(key: string) {
    return this.getters[this.namespaced(key) as string]
  }
  dispatch<P extends Payload>(key: string | P, ...args: any[]) {
    return this.context.dispatch(this.namespaced(key) as any, ...args)
  }
  commit<P extends Payload>(key: string | P, ...args: any[]) {
    return this.context.commit(this.namespaced(key) as any, ...args)
  }
  constructor(context: Store<S> | ActionContext<S, R>, path: string[] = [], namespace?: string) {
    this.context = context
    this.path = path
    this.namespace = namespace
    this.state = path.reduce((state, key) => state[key], context.state as any)
    this.getters = this.context.getters
    context = context as ActionContext<S, R>
    this.rootGetters = context.rootGetters ?? context.getters
    this.rootState = context.rootState ?? (context.state as any)
  }
}

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
  static factory?: () => any

  context!: ActionContext<S, R>

  static create<S>(module: Mod<S, any>) {
    const result = Object.assign({}, module)
    return result as typeof VuexModule
  }
}

export class VuexStore<S> extends Store<S> implements VuexStoreStatic<S> {
  _vmdModuleMap: ModuleMap

  constructor(module: StoreOptions<S>) {
    super(module)
    const statics = staticModuleGenerator(module, this)
    /// store.getters.$static.path.to.module
    /// store.getters['$static.path.to.module']
    /// store.getters['path/to/namepace/$static']
    this._vmdModuleMap = installStatics(this.getters, module, statics)
  }
}

type ConstructorOf<C> = {
  new (...args: any[]): C
}

interface ModuleMap extends Mod<any, any> {
  modules?: { [key: string]: ModuleMap }
  keys?: string[]
}

export function installStatics(
  root: any,
  module: ModuleMap,
  statics: any,
  path: string[] = [],
  namespace?: string,
  recursive: boolean = true
) {
  root[getStaticName(path)] = statics
  const moduleMap: ModuleMap = {
    namespaced: module.namespaced,
    modules: {}
  }

  const prefix = namespace ? `${namespace}/$statics/` : '$statics/'
  const keys = moduleMap.keys || []
  const actionKeys = Object.keys(module.actions || {})
  const gettersKey = Object.keys(module.getters || {})
  moduleMap.keys = keys.concat(actionKeys, gettersKey)
  moduleMap.keys.forEach((key) => (root[prefix + key] = statics))

  const modules = module.modules || {}
  if (recursive) {
    Object.keys(modules).forEach((key) => {
      const subModule = modules[key]
      const subNamespace = subModule.namespaced ? getNamespacedKey(namespace, key) : namespace
      moduleMap.modules![key] = installStatics(
        root,
        subModule,
        statics[key],
        path.concat(key),
        subNamespace,
        recursive
      )
    })
  }
  return moduleMap
}

export interface VuexStoreStatic<S> extends Store<S> {
  getters: { $statics: S }
}
