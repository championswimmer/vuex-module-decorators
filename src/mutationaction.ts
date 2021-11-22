import { Action as Act, ActionContext, Module as Mod, Mutation as Mut, Payload, Store } from 'vuex'
import { addPropertiesToObject } from './helpers'

export interface MutationActionParams<M> {
  mutate?: (keyof Partial<M>)[]
  rawError?: boolean
  root?: boolean
}

function mutationActionDecoratorFactory<T extends Object>(params: MutationActionParams<T>) {
  return function (
    target: T,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<Partial<T> | undefined>>
  ) {
    const module = target.constructor as Mod<T, any>
    if (!module.hasOwnProperty('mutations')) {
      module.mutations = Object.assign({}, module.mutations)
    }
    if (!module.hasOwnProperty('actions')) {
      module.actions = Object.assign({}, module.actions)
    }
    const mutactFunction = descriptor.value as (payload: any) => Promise<any>

    const action: Act<typeof target, any> = async function (
      context: ActionContext<typeof target, any>,
      payload: Payload
    ) {
      try {
        const thisObj = { context }
        addPropertiesToObject(thisObj, context.state)
        addPropertiesToObject(thisObj, context.getters)
        const actionPayload = await mutactFunction.call(thisObj, payload)
        if (actionPayload === undefined) return
        context.commit(key as string, actionPayload)
      } catch (e: any) {
        if (params.rawError) {
          throw e
        } else {
          console.error('Could not perform action ' + key.toString())
          console.error(e)
          return Promise.reject(e)
        }
      }
    }

    const mutation: Mut<typeof target> = function (
      state: typeof target | Store<T>,
      payload: Payload & { [k in keyof T]: any }
    ) {
      if (!params.mutate) {
        params.mutate = Object.keys(payload) as (keyof T)[]
      }
      for (let stateItem of params.mutate) {
        if (state.hasOwnProperty(stateItem) && payload.hasOwnProperty(stateItem)) {
          ;(state as T)[stateItem] = payload[stateItem]
        } else {
          throw new Error(`ERR_MUTATE_PARAMS_NOT_IN_PAYLOAD
          In @MutationAction, mutate: ['a', 'b', ...] array keys must
          match with return type = {a: {}, b: {}, ...} and must
          also be in state.`)
        }
      }
    }
    module.actions![key as string] = params.root ? { root: true, handler: action } : action
    module.mutations![key as string] = mutation
  }
}

export function MutationAction<K, T extends K>(
  target: { [k in keyof T]: T[k] | null },
  key: string | symbol,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<K>>
): void

export function MutationAction<T>(
  params: MutationActionParams<T>
): (
  target: T,
  key: string | symbol,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<T>>
) => void

/**
 * The @MutationAction decorator turns this into an action that further calls a mutation
 * Both the action and the mutation are generated for you
 *
 * @param paramsOrTarget the params or the target class
 * @param key the name of the function
 * @param descriptor the function body
 * @constructor
 */
export function MutationAction<T, K, M extends K>(
  paramsOrTarget: MutationActionParams<T> | M,
  key?: string | symbol,
  descriptor?: TypedPropertyDescriptor<(...args: any[]) => Promise<Partial<K> | undefined>>
):
  | ((
      target: T,
      key: string | symbol,
      descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<Partial<T> | undefined>>
    ) => void)
  | void {
  if (!key && !descriptor) {
    /*
     * This is the case when `paramsOrTarget` is params.
     * i.e. when used as -
     * <pre>
        @MutationAction({mutate: ['incrCount']})
        async getCountDelta() {
          return {incrCount: 5}
        }
     * </pre>
     */
    return mutationActionDecoratorFactory(paramsOrTarget as MutationActionParams<T>)
  } else {
    /*
     * This is the case when `paramsOrTarget` is target.
     * i.e. when used as -
     * <pre>
        @MutationAction
        async getCountDelta() {
          return {incrCount: 5}
        }
     * </pre>
     */
    mutationActionDecoratorFactory({} as MutationActionParams<K>)(
      paramsOrTarget as K,
      key!,
      descriptor!
    )
  }
}
