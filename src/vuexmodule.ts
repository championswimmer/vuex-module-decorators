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
import { getModuleName, getModuleNamespace, getModulePath } from './helpers'
import {
  staticActionGenerators,
  staticStateGenerator,
  staticGetterGenerator,
  staticMutationGenerator
} from './module/staticGenerators'

export class Context<S, R> implements ActionContext<S, R> {
  namespace?: string
  path!: string[]
  context!: Store<any> | ActionContext<S, R>
  state!: S
  rootState!: R
  getters: any // not implemented
  rootGetters: any
  namespaced(key: string | Payload) {
    if (!this.namespace) {
      return key
    }
    if (typeof key === 'string') {
      return `${this.namespace}/${key}`
    } else {
      const payload = key
      payload.type = `${this.namespace}/${payload.type}`
      return payload
    }
  }
  getter(key: string) {
    return this.rootGetters[this.namespaced(key) as string]
  }
  dispatch(key: string | Payload, ...args: any[]) {
    return this.context.dispatch(this.namespaced(key) as any, ...args)
  }
  commit(key: string | Payload, ...args: any[]) {
    return this.context.commit(this.namespaced(key) as any, ...args)
  }
  constructor(context: Store<any> | ActionContext<S, R>, path: string[] = [], namespace?: string) {
    this.context = context
    this.path = path
    this.namespace = namespace
    this.state = path.reduce((state, key) => state[key], this.context.state)
    this.getters = this.context.getters
    context = context as ActionContext<S, R>
    this.rootGetters = context.getters ?? context.getters
    this.rootState = context.rootState ?? this.context.state
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

  $module?: Mod<S, R>
  context!: Context<S, R>
  _statics: any

  static create<S>(module: Mod<S, any>) {
    return Object.assign({}, module) as typeof VuexModule
  }

  constructor(root?: Store<R> | ActionContext<S, R>, path?: string[], namespace?: string) {
    if (root === undefined) {
      return
    }
    Object.defineProperty(this, '$module', {
      value: this.constructor,
      enumerable: false
    })
    Object.defineProperty(this, 'context', {
      value: new Context(root, path, namespace),
      enumerable: false
    })
    const statics = {}
    staticStateGenerator(this, statics)
    staticGetterGenerator(this, statics)
    staticMutationGenerator(this, statics)
    staticActionGenerators(this, statics)
    Object.defineProperty(this, '_statics', {
      value: statics,
      enumerable: false
    })
  }
}

type ConstructorOf<C> = {
  new (...args: any[]): C
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

  const storeModule = new moduleClass(
    store,
    getModulePath(moduleClass),
    getModuleNamespace(moduleClass)
  )._statics

  if (store) {
    store.getters[moduleName] = storeModule
  } else {
    ;(moduleClass as any)._statics = storeModule
  }

  return storeModule
}
