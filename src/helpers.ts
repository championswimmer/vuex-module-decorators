/**
 * Takes the properties on object from paramerter y and adds them to the object
 * parameter x
 * @param {object} x  Object to have properties copied onto from y
 * @param {object} y  Object with properties to be copied to x
 */
export function addPropertiesToObject(x: any, y: any) {
  for (let k of Object.keys(y || {})) {
    Object.defineProperty(x, k, {
      get: () => y[k]
    })
  }
}
