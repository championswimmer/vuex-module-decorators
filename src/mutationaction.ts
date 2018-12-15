import { Action as Act, ActionContext, Module as Mod, Mutation as Mut, Payload, Store } from 'vuex'

export interface MutationActionParams<M = any> {
  mutate?: (keyof M)[]
  rawError?: boolean
}

function mutationActionDecoratorFactory<T>(params: MutationActionParams<T>) {
  return function (
    target: T,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<Partial<T>>>
  ) {
    const module = target.constructor as Mod<T, any>
    if (!module.mutations) {
      module.mutations = {}
    }
    if (!module.actions) {
      module.actions = {}
    }
    const mutactFunction = descriptor.value as (() => Promise<any>)

    const action: Act<typeof target, any> = async function (
      context: ActionContext<typeof target, any>,
      payload: Payload
    ) {
      try {
        const actionPayload = await mutactFunction.call(context, payload)
        context.commit(key as string, actionPayload)
      } catch (e) {
        if (params.rawError) {
          throw e
        } else {
          console.error('Could not perform action ' + key.toString())
          console.error(e)
        }
      }
    }

    const mutation: Mut<typeof target> = function (
      state: typeof target & Store<T>,
      payload: Payload & { [k in keyof T]: any }
    ) {
      if (!params.mutate) {
        params.mutate = Object.keys(payload) as (keyof T)[]
      }
      for (let stateItem of params.mutate) {
        if (state.hasOwnProperty(stateItem) && payload.hasOwnProperty(stateItem)) {
          state[ stateItem ] = payload[ stateItem ]
        } else {
          throw new Error(`ERR_MUTATE_PARAMS_NOT_IN_PAYLOAD
          In @MutationAction, mutate: ['a', 'b', ...] array keys must
          match with return type = {a: {}, b: {}, ...} and must
          also be in state.`)
        }
      }
    }
    module.actions[ key as string ] = action
    module.mutations[ key as string ] = mutation
  }
}

export function MutationAction<K> (
  target: K,
  key: string | symbol,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<Partial<K>>>
): void

export function MutationAction<T> (
  params: MutationActionParams<T>
): ((
  target: T,
  key: string | symbol,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<Partial<T>>>
) => void)

/**
 * The @MutationAction decorator turns this into an action that further calls a mutation
 * Both the action and the mutation are generated for you
 *
 * @param paramsOrTarget the params or the target class
 * @param key the name of the function
 * @param descriptor the function body
 * @constructor
 */
export function MutationAction<T, K>(
  paramsOrTarget: MutationActionParams<T> | K,
  key?: string | symbol,
  descriptor?: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>
): ((
  target: T,
  key: string | symbol,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<Partial<T>>>
) => void) | void {
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
    mutationActionDecoratorFactory({} as MutationActionParams<K>)(paramsOrTarget as K, key!, descriptor!)
  }
}
