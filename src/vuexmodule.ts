import {ActionTree, GetterTree, Module as Mod, ModuleTree, MutationTree, Store, Commit} from 'vuex'

export class VuexModule<S = ThisType<S>, R = any> implements Mod<S, R> {
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
  commit!: Commit

  constructor(module: Mod<S, any>) {
    this.actions = module.actions
    this.mutations = module.mutations
    this.state = module.state
    this.getters = module.getters
    this.namespaced = module.namespaced
    this.modules = module.modules
  }

}

export function getModule<M extends VuexModule>(
  moduleClass: M,
): M {
  const statics: M = (moduleClass.constructor as any)._statics
  if (!statics) {
    throw new Error (`ERR_GET_MODULE_NO_STATICS : Could not get module accessor. 
      Make sure your module is dynamic and has name,
      i.e. @Module({dynamic: true, name: 'something' })`)
  }
  return statics
}