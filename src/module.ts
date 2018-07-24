import {ActionTree, GetterTree, Module as Mod, ModuleTree, MutationTree} from 'vuex'
import {DynamicModuleOptions, ModuleOptions} from './moduleoptions'

function moduleDecoratorFactory<S> (modOrOpt: ModuleOptions | Function & Mod<S,any>) {

  return function <TFunction extends Function>(constructor: TFunction): TFunction | void  {
    const module: Function & Mod<S,any> = constructor
    const stateFactory = function() {
      const state = new (module.prototype.constructor)({})
      const s = <S>{}
      Object.keys(state).forEach((key: string) => {
        if (state.hasOwnProperty(key)) {
          if (typeof state[key] !== 'function') {
            (s as any)[key] = state[key]
          }
        }
      })

      return s
    }

    if (!module.state) {
      module.state = (modOrOpt && (<ModuleOptions>modOrOpt).stateFactory) ? stateFactory : stateFactory()
    }

    if (!module.getters) {
      module.getters = {} as GetterTree<S,any>
    }
    module.namespaced = modOrOpt && modOrOpt.namespaced
    Object.getOwnPropertyNames(module.prototype).forEach((funcName: string) => {
      const descriptor = Object.getOwnPropertyDescriptor(module.prototype, funcName)
      if (descriptor.get) {
        module.getters[funcName] = (moduleState: S) => descriptor.get.call(moduleState)
      }
    })
    if ((<DynamicModuleOptions>modOrOpt).dynamic) {
      const modOpt: DynamicModuleOptions = modOrOpt as DynamicModuleOptions

      modOpt.store.registerModule(
        modOpt.name,              // TODO: Handle nested modules too in future
        module
      )
    }
  }

}
export function Module<S> (module: Function & Mod<S,any>): void
export function Module<S> (options: ModuleOptions): ClassDecorator

export function Module<S> (modOrOpt: ModuleOptions | Function & Mod<S,any>) {
  if (typeof modOrOpt === 'function') {
    /*
     * @Module decorator called without options (directly on the class definition)
     */
    moduleDecoratorFactory({})(modOrOpt)
  } else {
    /*
     * @Module({...}) decorator called with options
     */
    return moduleDecoratorFactory(modOrOpt)
  }
}
