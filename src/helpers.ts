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
