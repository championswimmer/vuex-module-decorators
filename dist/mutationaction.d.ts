export interface MutationActionParams {
    mutate: string[];
}
export declare function MutationAction<T>(params: MutationActionParams): (target: T, key: string | symbol, descriptor: TypedPropertyDescriptor<Function>) => void;
