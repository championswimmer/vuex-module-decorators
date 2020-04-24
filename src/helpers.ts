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
export function getModuleName(module: any): string {
  if (!module._vmdModuleName) {
    throw new Error(`ERR_GET_MODULE_NAME : Could not get module accessor.
      Make sure your module has name, we can't make accessors for unnamed modules
      i.e. @Module({ name: 'something' })`)
  }
  if (module.namespaced) {
    return `${module._vmdModuleName}/$context`
  }
  return '$context'
}

/**
 * Returns a namespaced name of the module to be used as a store getter
 * @param module
 */
export function getModuleNamespace(module: any): string {
  if (!module._vmdModuleName) {
    throw new Error(`ERR_GET_MODULE_NAME : Could not get module accessor.
      Make sure your module has name, we can't make accessors for unnamed modules
      i.e. @Module({ name: 'something' })`)
  }
  if (module.namespaced) {
    return `${module._vmdModuleName}`
  }
  return ''
}

/**
 * Returns a namespaced path of the module to be used as a store getter
 * @param module
 */
export function getModulePath(module: any): string[] {
  if (!module._vmdModuleName) {
    throw new Error(`ERR_GET_MODULE_NAME : Could not get module accessor.
      Make sure your module has name, we can't make accessors for unnamed modules
      i.e. @Module({ name: 'something' })`)
  }
  return [`${module._vmdModuleName}`]
}
