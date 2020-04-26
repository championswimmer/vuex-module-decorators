import {
  ActionTree,
  GetterTree,
  Module as Mod,
  ModuleTree,
  MutationTree,
  Store,
  ActionContext,
  Payload
} from 'vuex'
import {
  getModuleName,
  getModuleNamespace,
  getModulePath,
  getStaticName,
  getNamespacedKey
} from './helpers'
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
    return this.rootGetters[this.namespaced(key) as string]
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

export interface VuexStore<S> extends Store<S> {
  getters: { $statics: S }
}

export function newStore<M extends VuexModule>(module: ConstructorOf<M>): VuexStore<M>
export function newStore<S>(module: Mod<S, S>): VuexStore<S>
export function newStore<S, M extends VuexModule>(
  module: Mod<S, S> | (Mod<S, S> & ConstructorOf<M>)
) {
  const store = new Store(module)
  const statics = staticModuleGenerator(module, store)
    /// store.getters.$static.path.to.module
    /// store.getters['$static.path.to.module']
    /// store.getters['path/to/namepace/$static']
  ;(store as any)._vmdModuleMap = installStatics(store.getters, module, statics)

  return store
}

export function getModule<M extends VuexModule, R>(
  moduleClass: ConstructorOf<M>,
  store?: Store<R>
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

  if (store.getters[moduleName]) {
    return store.getters[moduleName]
  }

  const storeModule = staticModuleGenerator(
    moduleClass as Mod<M, R>,
    store,
    getModulePath(moduleClass),
    getModuleNamespace(moduleClass),
    false
  )

  store.getters[moduleName] = storeModule

  return storeModule
}
