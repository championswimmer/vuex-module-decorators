/**
 * Parameters that can be passed to the @Action decorator
 */
export interface ActionDecoratorParams {
    commit?: string;
    rawError?: boolean;
    root?: boolean;
}
export declare function Action<T, R>(target: T, key: string | symbol, descriptor: TypedPropertyDescriptor<(...args: any[]) => R>): void;
export declare function Action<T>(params: ActionDecoratorParams): MethodDecorator;
