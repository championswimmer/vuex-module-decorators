import {ActionTree, GetterTree, Module as Mod, ModuleTree, MutationTree} from 'vuex'

export class VuexModule<S=ThisType<S>, R=any> implements Mod<S,R> {
  /*
   * To use with `extends Class` syntax along with decorators
   */
  static namespaced?: boolean;
  static state?: any | (() => any);
  static getters?: GetterTree<any, any>;
  static actions?: ActionTree<any, any>;
  static mutations?: MutationTree<any>;
  static modules?: ModuleTree<any>;

  /*
   * To use with `new VuexModule(<ModuleOptions>{})` syntax
   */

  modules?: ModuleTree<any>
  namespaced?: boolean
  getters?: GetterTree<S, R>
  state?: S | (() => S)
  mutations?: MutationTree<S>
  actions?: ActionTree<S, R>

  constructor(module: Mod<S, any>) {
    this.actions = module.actions
    this.mutations = module.mutations
    this.state = module.state
    this.getters = module.getters
    this.namespaced = module.namespaced
    this.modules = module.modules
  }
}

/**
 * Options to pass to the @Module decorator
 */
export interface ModuleOptions {
  /**
   * name of module, if being namespaced
   */
  name?: string
  namespaced?: boolean
}

function moduleDecoratorFactory<S> (modOrOpt: ModuleOptions | Function & Mod<S,any>) {

  return function <TFunction extends Function>(constructor: TFunction): TFunction | void  {
    const module: Function & Mod<S,any> = constructor
    const state = new (module.prototype.constructor)({})
    if (!module.state) {
      module.state = <S>{}
    }
    module.namespaced = modOrOpt && modOrOpt.namespaced
    Object.keys(state).forEach((key: string) => {
      if (state.hasOwnProperty(key) && typeof state[key] !== 'function') {
        (module.state as any)[key] = state[key]
      }
    })
  }

}
export function Module<S> (module: Function & Mod<S,any>): void
export function Module<S> (options: ModuleOptions): ClassDecorator

export function Module<S> (modOrOpt: ModuleOptions | Function & Mod<S,any>) {
  if (typeof modOrOpt === 'function') {
    moduleDecoratorFactory({})(modOrOpt)
  } else {
    return moduleDecoratorFactory(modOrOpt)
  }
}
