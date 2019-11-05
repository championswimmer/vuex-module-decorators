import { Action as Act, ActionContext, Module as Mod, Payload } from 'vuex'
import { getModule, VuexModule } from './vuexmodule'
import { addPropertiesToObject } from './helpers'

type Func<A, R> = (payload: A) => Promise<R>

type MethodDecorator<R, A> = (
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<Func<A, R>>
) => TypedPropertyDescriptor<Func<A, R>> | void

/**
 * Parameters that can be passed to the @Action decorator
 */
export interface ActionDecoratorParams {
  commit?: string
  rawError?: boolean
  root?: boolean
}

function actionDecoratorFactory<T, R, A>(params?: ActionDecoratorParams): MethodDecorator<R, A> {
  const { commit = undefined, rawError = false, root = false } = params || {}
  return function(
    target: Object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<Func<A, R>>
  ) {
    const module = target.constructor as Mod<T, any>
    if (!module.hasOwnProperty('actions')) {
      module.actions = Object.assign({}, module.actions)
    }
    const actionFunction = (descriptor.value as unknown) as Func<A, R>
    const action: Act<typeof target, any> = async function(
      context: ActionContext<typeof target, any>,
      payload: any
    ) {
      try {
        let actionPayload = null

        if ((module as any)._genStatic) {
          const moduleAccessor = getModule(module as typeof VuexModule)
          moduleAccessor.context = context
          actionPayload = await actionFunction.call(moduleAccessor, payload as A)
        } else {
          const thisObj = { context }
          addPropertiesToObject(thisObj, context.state)
          addPropertiesToObject(thisObj, context.getters)
          actionPayload = await actionFunction.call(thisObj, payload as A)
        }
        if (commit) {
          context.commit(commit, actionPayload)
        }
        return actionPayload
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
    module.actions![key as string] = root ? { root, handler: action } : action
  }
}

export function Action<T, R, A>(
  target: T,
  key: string | symbol,
  descriptor: TypedPropertyDescriptor<Func<A, R>>
): void
export function Action<T, R, A>(params: ActionDecoratorParams): MethodDecorator<R, A>

/**
 * The @Action decorator turns an async function into an Vuex action
 *
 * @param targetOrParams the module class
 * @param key name of the action
 * @param descriptor the action function descriptor
 * @constructor
 */
export function Action<T, R, A>(
  targetOrParams: T | ActionDecoratorParams,
  key?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Func<A, R>>
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
    return actionDecoratorFactory<T, R, A>(targetOrParams as ActionDecoratorParams)
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
    actionDecoratorFactory<T, R, A>()(targetOrParams, key!, descriptor!)
  }
}
