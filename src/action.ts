import {Action as Act, ActionContext, Module as Mod, Payload} from 'vuex'

export interface ActionDecoratorParams {
  commit: string
}
function actionDecoratorFactory<T> (params?: ActionDecoratorParams): MethodDecorator {
  return function (target: T, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const module = target.constructor as Mod<T,any>
    if (!module.actions) {
      module.actions = {}
    }
    const actionFunction: Function = descriptor.value
    const action: Act<typeof target, any> = async function(context: ActionContext<typeof target, any>, payload: Payload) {
      try {
        const actionPayload = await actionFunction.call(context, payload)
        if (params) {
          if (params.commit) {
            context.commit(params.commit, actionPayload)
          }
        }
      } catch (e) {
        console.error('Could not perform action ' + key.toString())
        console.error(e)
      }
    }
    module.actions[key] = action
  }
}
export function Action<T> (target: T, key: string | symbol, descriptor: TypedPropertyDescriptor<Function>): void
export function Action<T> (params: ActionDecoratorParams): MethodDecorator

export function Action<T> (targetOrParams: T | ActionDecoratorParams, key?: string | symbol,  descriptor?: TypedPropertyDescriptor<Function>) {
  if (!key && !descriptor) {
    return actionDecoratorFactory(targetOrParams as ActionDecoratorParams)
  } else {
    actionDecoratorFactory()(targetOrParams, key, descriptor)
  }
}

