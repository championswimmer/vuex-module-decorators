import { Module as Mod } from 'vuex'
import { VuexModule } from './vuexmodule'

export interface SubmoduleDecoratorParams<S, R> {
  module: Mod<S, R>
  namespaced?: boolean
  init?: () => S | S
}

function submoduleDecoratorFactory<S, R>(
  params: SubmoduleDecoratorParams<S, R>
): PropertyDecorator {
  return function<T extends Object>(target: T, key: string | symbol) {
    const module = target.constructor as Mod<T, any>
    if (!module.hasOwnProperty('modules')) {
      module.modules = Object.assign({}, module.modules)
    }
    const subModule = VuexModule.create(params.module)
    if (params.namespaced === undefined && subModule.namespaced === undefined) {
      /// unlike module, submodule's namespace is default to true
      subModule.namespaced = true
    } else if (params.namespaced !== undefined) {
      subModule.namespaced = params.namespaced
    }
    if (params.init !== undefined) {
      subModule.state = params.init
    }
    module.modules![key as string] = subModule
  }
}

export function Submodule<T>(target: T, key: string | symbol): void
export function Submodule<T, S = any, R = any>(
  params: SubmoduleDecoratorParams<S, R>
): PropertyDecorator

/**
 * The @SubModule decorator turns this into an submodule
 *
 * @param paramsOrTarget the params or the target class
 * @param key the name of the submodule
 * @constructor
 */
export function Submodule<T, S, R, K, M extends K>(
  paramsOrTarget: SubmoduleDecoratorParams<S, R> | M,
  key?: string | symbol
): ((target: T, key: string | symbol) => void) | void {
  if (!key) {
    /*
     * This is the case when `paramsOrTarget` is params.
     * i.e. when used as -
     * <pre>
        @Submodule({module: MySubModule})
        subName!: MySubModule
     * </pre>
     */
    return submoduleDecoratorFactory(paramsOrTarget as SubmoduleDecoratorParams<S, R>)
  } else {
    /*
     * This is the case when `paramsOrTarget` is target.
     * i.e. when used as -
     * <pre>
        @Submodule
        async getCountDelta() {
          return {incrCount: 5}
        }
     * </pre>
     */
    submoduleDecoratorFactory({} as SubmoduleDecoratorParams<S, R>)(paramsOrTarget as K, key)
  }
}
