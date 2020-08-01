import { Action as Act, ActionContext, Module as Mod, Payload } from 'vuex'
import { addPropertiesToObject } from './helpers'
import { config } from './config'

/**
 * Parameters that can be passed to the @Action decorator
 */
export interface ActionDecoratorParams {
  commit?: string
  rawError?: boolean
  root?: boolean
}
function actionDecoratorFactory<T>(params?: ActionDecoratorParams): MethodDecorator {
  const { commit = undefined, rawError = !!config.rawError, root = false } = params || {}
  return function(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const module = target.constructor as Mod<T, any>
    if (!module.hasOwnProperty('actions')) {
      module.actions = Object.assign({}, module.actions)
    }
    const actionFunction: Function = descriptor.value
    const staticKey = '$statics/' + String(key)
    const action: Act<typeof target, any> = async function(
      context: ActionContext<typeof target, any>,
      payload: Payload
    ) {
      let actionPayload

      if (context.getters[staticKey]) {
        const moduleAccessor = context.getters[staticKey]
        moduleAccessor.context = context
        actionPayload = await actionFunction.call(moduleAccessor, payload)
      } else {
        const thisObj = { context }
        addPropertiesToObject(thisObj, context.state)
        addPropertiesToObject(thisObj, context.getters)
        try {
          actionPayload = await actionFunction.call(thisObj, payload)
        } catch (e) {
          throw rawError
            ? e
            : new Error(
                'ERR_ACTION_ACCESS_UNDEFINED: Are you trying to access ' +
                  'this.someMutation() or this.someGetter inside an @Action? \n' +
                  'That works only in dynamic modules. \n' +
                  'If not dynamic use this.context.commit("mutationName", payload) ' +
                  'and this.context.getters["getterName"]' +
                  '\n' +
                  new Error(`Could not perform action ${key.toString()}`).stack +
                  '\n' +
                  e.stack
              )
        }
      }
      if (commit) {
        context.commit(commit, actionPayload)
      }
      return actionPayload
    }
    module.actions![key as string] = root ? { root, handler: action } : action
  }
}

export function Action<T, R>(
  target: T,
  key: string | symbol,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => R>
): void
export function Action<T>(params: ActionDecoratorParams): MethodDecorator

/**
 * The @Action decorator turns an async function into an Vuex action
 *
 * @param targetOrParams the module class
 * @param key name of the action
 * @param descriptor the action function descriptor
 * @constructor
 */
export function Action<T, R>(
  targetOrParams: T | ActionDecoratorParams,
  key?: string | symbol,
  descriptor?: TypedPropertyDescriptor<(...args: any[]) => R>
) {
  if (!key && !descriptor) {
    /*
     * This is the case when `targetOrParams` is params.
     * i.e. when used as -
     * <pre>
        @Action({commit: 'incrCount'})
        async getCountDelta() {
          return 5
        }
     * </pre>
     */
    return actionDecoratorFactory(targetOrParams as ActionDecoratorParams)
  } else {
    /*
     * This is the case when @Action is called on action function
     * without any params
     * <pre>
     *   @Action
     *   async doSomething() {
     *    ...
     *   }
     * </pre>
     */
    actionDecoratorFactory()(targetOrParams, key!, descriptor!)
  }
}
