import { Store } from 'vuex'
import { VuexModule } from './vuexmodule'

/* eslint "@typescript-eslint/no-explicit-any": 0 */

declare type ConstructorOf<C> = {
  new (...args: any[]): C
}

export class VuexStore<M extends VuexModule> {
  constructor(
    moduleClass: ConstructorOf<M>,
    store?: Store<any>,
    namespace: string[] | string | null = null
  ) {
    const module = (moduleClass as any) as VuexModule<M>
    if (store === undefined) {
      store = new Store(module)
      Object.defineProperty(store.getters, '$', {
        get: () => this
      })
    }
    this.$store = store
    this._class = module
    if (namespace && typeof namespace !== 'string') {
      namespace = namespace.join('/')
    }
    this._namespace = namespace
    this._path = namespace ? namespace.split('/') : []
    console.log(this)
  }

  $store: Store<any>
  _path: string[]
  _namespace: string | null
  _class: VuexModule<M>
  _statics?: M

  get state() {
    return this._path.reduce((state, key) => state[key], this.$store.state)
  }
  namespaced(key: string) {
    return [...this._path, key].join('/')
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
      this._statics = this.genStatic()
    }
    return this._statics
  }

  genStatic() {
    const statics: any = {}
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
        Object.defineProperty(statics, key, {
          get: () => this.getter(key)
        })
      })

    const mutations = this._class.mutations || {}
    Object.keys(mutations)
      .filter(Object.hasOwnProperty.bind(mutations))
      .forEach((key) => {
        const namespacedKey = this.namespaced(key)
        statics[key] = (...args: any[]) => {
          return this.$store.commit(namespacedKey, ...args)
        }
      })

    const actions = this._class.actions || {}
    Object.keys(actions)
      .filter(Object.hasOwnProperty.bind(actions))
      .forEach((key) => {
        const namespacedKey = this.namespaced(key)
        statics[key] = (...args: any[]) => {
          return this.$store.dispatch(namespacedKey, ...args)
        }
      })
    return statics as M
  }
}
