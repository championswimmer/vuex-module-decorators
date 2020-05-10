import { DynamicModuleOptions } from './moduleoptions'
import { VueConstructor } from 'vue'
import Vuex from 'vuex'

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
 * Returns a namespaced name of the module to be used as a store getter
 * @param module
 */
export function getModuleName(modOpt: DynamicModuleOptions): string {
  return getStaticName(getModulePath(modOpt))
}

export function getStaticName(path: string[]): string {
  if (path.length === 0) {
    return '$statics'
  }
  return '$statics.' + path.join('.')
}

/**
 * Returns a namespaced name of the module to be used as a store getter
 * @param module
 */
export function getModuleNamespace(modOpt: DynamicModuleOptions): string {
  if (!modOpt.name) {
    throw new Error(`ERR_GET_MODULE_NAME : Could not get module accessor.
      Make sure your module has name, we can't make accessors for unnamed modules
      i.e. @Module({ name: 'something' })`)
  }
  if (modOpt.namespaced) {
    return `${modOpt.name}`
  }
  return ''
}

/**
 * Returns a namespaced path of the module to be used as a store getter
 * @param module
 */
export function getModulePath(modOpt: DynamicModuleOptions): string[] {
  if (!modOpt.name) {
    throw new Error(`ERR_GET_MODULE_NAME : Could not get module accessor.
      Make sure your module has name, we can't make accessors for unnamed modules
      i.e. @Module({ name: 'something' })`)
  }
  return modOpt.name.split('/')
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
