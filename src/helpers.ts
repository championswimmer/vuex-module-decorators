import { VueConstructor } from 'vue'
import Vuex from 'vuex'
import { ModuleMap } from './vuexmodule'

/**
 * Takes the properties on object from parameter source and adds them to the object
 * parameter target
 * @param {object} target  Object to have properties copied onto from y
 * @param {object} source  Object with properties to be copied to x
 */
export function addPropertiesToObject(target: any, source: any) {
  for (let k of Object.keys(source || {})) {
    Object.defineProperty(target, k, {
      get: () => source[k]
    })
  }
}

/**
 * Returns a path based name of the module to be used for store access
 * @param path
 */
export function getStaticName(path: string[]): string {
  if (path.length === 0) {
    return '$statics'
  }
  return '$statics.' + path.join('.')
}

/**
 * Returns a namespaced name of the module to be used as a store getter
 * @param module
 * @param path
 * @param namespaced
 */
export function getModuleNamespace(module: ModuleMap, path: string[], namespaced: boolean): string {
  let namespace = ''
  if (path.length === 0) {
    return namespace
  }
  for (const key of path.slice(0, -1)) {
    if (!module.modules || !module.modules[key]) {
      throw new Error(`ERR_DYNAMIC_MODULE_NOT_EXISTS : Could not create module.
        Make sure your path to your dynamic submodule exists
        i.e. @Module({ name: "path.to.exits.name", store, dynamic: true })`)
    }
    module = module.modules[key]
    if (module.namespaced) {
      namespace = namespace + key + '/'
    }
  }
  if (namespaced) {
    return namespace + path[path.length - 1]
  }
  return namespace.slice(0, -1)
}

export function getNamespacedKey(namespace: string | null | undefined, key: string) {
  return namespace ? `${namespace}/${key}` : key
}

export function install<R>(Vue: VueConstructor) {
  Vue.use(Vuex)
  Vue.mixin({ beforeCreate: storeInit })

  function storeInit(this: Vue) {
    Object.defineProperty(this, '$stock', {
      get: (): R => this.$store.getters.$statics
    })
  }
}
