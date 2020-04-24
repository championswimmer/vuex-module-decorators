import { Store } from 'vuex'
import { VuexModule } from './vuexmodule'

declare type ConstructorOf<C> = {
  new (...args: any[]): C
}

export class VuexStore<M extends VuexModule> {
  constructor(
    moduleClass: ConstructorOf<M>,
    store?: Store<any>,
    path: string[] = [],
    namespace: string = ''
  ) {
    const module = (moduleClass as any) as VuexModule<M>
    if (store === undefined) {
      if (path.length !== 0) {
        throw new Error(`ERR_STORE_NOT_PROVIDED: To use VuexStore, either the store should
          be provided, or the path should be [].`)
      }
      store = new Store(module)
      Object.defineProperty(store.getters, '$context', {
        get: () => this.statics,
        configurable: true
      })
    }
    this.$store = store
    this._class = module
    this._path = path
    this._namespace = namespace
  }

  $store: Store<any>
  _path: string[]
  _namespace: string | null
  _class: VuexModule<M>
  _statics?: M

  get state() {
    const state = this._path.reduce((state, key) => state[key], this.$store.state)
    return state
  }
  namespaced(key: string) {
    return this._namespace ? `${this._namespace}/${key}` : key
  }
  getter(key: string) {
    return this.$store.getters(this.namespaced(key))
  }
  commit(key: string, ...args: any[]) {
    return this.$store.commit(this.namespaced(key), ...args)
  }
  dispatch(key: string, ...args: any[]) {
    return this.$store.dispatch(this.namespaced(key), ...args)
  }

  get statics(): M {
    if (this._statics === undefined) {
      const configuredPath = this._path.join('.')
      const configured =
        this.$store.getters[this.namespaced('$paths')] ||
        (this.$store.getters[this.namespaced('$paths')] = [])
      const oldStatics = this.$store.getters[this.namespaced('$context')]
      if (configured.indexOf(configuredPath) !== -1) {
        this._statics = oldStatics
        return this._statics!
      }
      const statics = this.genStatic(oldStatics)
      Object.defineProperty(this.$store.getters, this.namespaced('$context'), {
        get: () => statics,
        configurable: true
      })
      configured.push(configuredPath)
      this._statics = statics
    }
    return this._statics
  }

  genStatic(statics: any = {}) {
    const state = this.state || {}
    Object.keys(state)
      .filter(Object.hasOwnProperty.bind(state))
      .forEach((key) => {
        // If not undefined or function means it is a state value
        if (['undefined', 'function'].indexOf(typeof state[key]) === -1) {
          Object.defineProperty(statics, key, {
            get: () => this.state[key]
          })
        }
      })

    const getters = this._class.getters || {}
    Object.keys(getters)
      .filter(Object.hasOwnProperty.bind(getters))
      .forEach((key) => {
        const namespacedKey = (getters[key] as any).root ? key : this.namespaced(key)
        Object.defineProperty(statics, key, {
          get: () => this.$store.getters[namespacedKey]
        })
      })

    const mutations = this._class.mutations || {}
    Object.keys(mutations)
      .filter(Object.hasOwnProperty.bind(mutations))
      .forEach((key) => {
        const namespacedKey = (mutations[key] as any).root ? key : this.namespaced(key)
        statics[key] = (...args: any[]) => {
          return this.$store.commit(namespacedKey, ...args)
        }
      })

    const actions = this._class.actions || {}
    Object.keys(actions)
      .filter(Object.hasOwnProperty.bind(actions))
      .forEach((key) => {
        const namespacedKey = (actions[key] as any).root ? key : this.namespaced(key)
        statics[key] = (...args: any[]) => {
          return this.$store.dispatch(namespacedKey, ...args)
        }
      })
    return statics as M
  }
}
