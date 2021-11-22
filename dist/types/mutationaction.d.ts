export interface MutationActionParams<M> {
    mutate?: (keyof Partial<M>)[];
    rawError?: boolean;
    root?: boolean;
}
export declare function MutationAction<K, T extends K>(target: {
    [k in keyof T]: T[k] | null;
}, key: string | symbol, descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<K>>): void;
export declare function MutationAction<T>(params: MutationActionParams<T>): (target: T, key: string | symbol, descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<T>>) => void;
