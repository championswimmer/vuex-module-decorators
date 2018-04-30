export interface ActionDecoratorParams {
    commit: string;
}
export declare function Action<T>(target: T, key: string | symbol, descriptor: TypedPropertyDescriptor<Function>): void;
export declare function Action<T>(params: ActionDecoratorParams): MethodDecorator;
