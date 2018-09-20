import { Action as Act, ActionContext, Module as Mod, Payload } from 'vuex'
import { getModule, VuexModule } from './vuexmodule'

/**
 * Parameters that can be passed to the @Action decorator
 */
export interface ActionDecoratorParams {
  commit: string
}
function actionDecoratorFactory<T>(params?: ActionDecoratorParams): MethodDecorator {
  return function(target: T, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const module = target.constructor as Mod<T, any>
    if (!module.actions) {
      module.actions = {}
    }
    const actionFunction: Function = descriptor.value
    const action: Act<typeof target, any> = async function(
      context: ActionContext<typeof target, any>,
      payload: Payload
    ) {
      try {
        let actionPayload = null

        if ((module as any)._genStatic) {
          const moduleAccessor = getModule(module as typeof VuexModule)
          moduleAccessor.context = context
          actionPayload = await actionFunction.call(moduleAccessor, payload)
        } else {
          ;(context.state as any).context = context
          actionPayload = await actionFunction.call(context.state, payload)
          delete (context.state as any).context
        }
        if (params) {
          if (params.commit) {
            context.commit(params.commit, actionPayload)
          }
        }
      } catch (e) {
        throw new Error(
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
    module.actions[key as string] = action
  }
}

export function Action<T, R>(
  target: T,
  key: string | symbol,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => R>
): void
export function Action<T>(params: ActionDecoratorParams): MethodDecorator

/**
 * /**
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
