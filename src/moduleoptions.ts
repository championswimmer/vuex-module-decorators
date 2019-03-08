import { Store } from 'vuex'
/**
 * Options to pass to the @Module decorator
 */
export interface StaticModuleOptions {
  /**
   * name of module, if being namespaced
   */
  name?: string
  /**
   * whether or not the module is namespaced
   */
  namespaced?: boolean
  /**
   * Whether to generate a plain state object, or a state factory for the module
   */
  stateFactory?: boolean
}

export interface DynamicModuleOptions {
  /**
   * If this is a dynamic module (added to store after store is created)
   */
  dynamic: true

  /**
   * The store into which this module will be injected
   */
  store: Store<any>

  /**
   * name of module, compulsory for dynamic modules
   */
  name: string

  /**
   * If this is enabled it will try to load the state when loading the module dynamically.
   * e.g when loading the state with vuex-persist
   */
  loadInitialState?: true

  /**
   * whether or not the module is namespaced
   */
  namespaced?: boolean

  /**
   * Whether to generate a plain state object, or a state factory for the module
   */
  stateFactory?: boolean
}

export type ModuleOptions = StaticModuleOptions | DynamicModuleOptions
