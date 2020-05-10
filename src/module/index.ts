import { GetterTree, Module as Mod } from 'vuex'
import { DynamicModuleOptions, ModuleOptions } from '../moduleoptions'
import { stateFactory as sf } from './stateFactory'
import { addPropertiesToObject, getModuleName, getModuleNamespace, getModulePath } from '../helpers'
import { staticModuleGenerator } from './staticGenerators'
import { installStatics } from '../vuexmodule'

function registerDynamicModule<S>(module: Mod<S, any>, modOpt: DynamicModuleOptions) {
  if (!modOpt.name) {
    throw new Error('Name of module not provided in decorator options')
  }

  if (!modOpt.store) {
    throw new Error('Store not provided in decorator options when using dynamic option')
  }

  const oldStatics = modOpt.store.getters.$statics
  const moduleMap = (modOpt.store as any)._vmdModuleMap
  modOpt.store.registerModule(
    modOpt.name, // TODO: Handle nested modules too in future
    module,
    { preserveState: modOpt.preserveState || false }
  )
  if (moduleMap && oldStatics) {
    installStatics(modOpt.store.getters, moduleMap, oldStatics)
    const path = getModulePath(modOpt)
    const name = path[path.length - 1]
    const namespace = getModuleNamespace(modOpt)
    const recursive = true
    const statics = staticModuleGenerator(module, modOpt.store, path, namespace, recursive)
    const parentStatics = path.slice(0, -1).reduce((s, key) => s[key], oldStatics)
    parentStatics[name] = statics
    const parentModuleMap = path.slice(0, -1).reduce((s, key) => s[key], moduleMap)
    parentModuleMap[name] = installStatics(
      modOpt.store.getters,
      module,
      statics,
      path,
      namespace,
      recursive
    )
  }
}

function moduleDecoratorFactory<S>(moduleOptions: ModuleOptions) {
  return function<TFunction extends Function>(constructor: TFunction): TFunction | void {
    const module: Function & Mod<S, any> = constructor
    const stateFactory = () => sf(module)
    Object.defineProperty(constructor, 'factory', {
      get() {
        return stateFactory
      }
    })

    if (!module.state) {
      module.state = moduleOptions && moduleOptions.stateFactory ? stateFactory : stateFactory()
    }
    if (!module.getters) {
      module.getters = {} as GetterTree<S, any>
    }
    if (!module.namespaced) {
      module.namespaced = moduleOptions && moduleOptions.namespaced
    }
    Object.getOwnPropertyNames(module.prototype).forEach((funcName: string) => {
      const descriptor = Object.getOwnPropertyDescriptor(
        module.prototype,
        funcName
      ) as PropertyDescriptor
      if (descriptor.get && module.getters) {
        const staticKey = '$statics/' + funcName
        module.getters[funcName] = function(
          state: S,
          getters: any,
          rootState: any,
          rootGetters: any
        ) {
          const context = { state, getters, rootState, rootGetters }
          let moduleAccessor
          if (getters[staticKey]) {
            moduleAccessor = getters[staticKey]
            moduleAccessor.context = context
          } else {
            moduleAccessor = { context }
            addPropertiesToObject(moduleAccessor, state)
            addPropertiesToObject(moduleAccessor, getters)
          }
          const got = (descriptor.get as Function).call(moduleAccessor)
          return got
        }
      }
    })
    const modOpt = moduleOptions as DynamicModuleOptions

    if (modOpt.dynamic) {
      registerDynamicModule(module, modOpt)
    }
    return constructor
  }
}

export function Module<S>(module: Function & Mod<S, any>): void
export function Module<S>(options: ModuleOptions): ClassDecorator

export function Module<S>(modOrOpt: ModuleOptions | (Function & Mod<S, any>)) {
  if (typeof (modOrOpt as any) === 'function') {
    /*
     * @Module decorator called without options (directly on the class definition)
     */
    moduleDecoratorFactory({})(modOrOpt as Function & Mod<S, any>)
  } else {
    /*
     * @Module({...}) decorator called with options
     */
    return moduleDecoratorFactory(modOrOpt)
  }
}
