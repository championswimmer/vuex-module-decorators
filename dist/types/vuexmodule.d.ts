import { ActionTree, GetterTree, Module as Mod, ModuleTree, MutationTree, Store, ActionContext } from 'vuex';
export declare class VuexModule<S = ThisType<any>, R = any> implements Mod<S, R> {
    static namespaced?: boolean;
    static state?: any | (() => any);
    static getters?: GetterTree<any, any>;
    static actions?: ActionTree<any, any>;
    static mutations?: MutationTree<any>;
    static modules?: ModuleTree<any>;
    modules?: ModuleTree<any>;
    namespaced?: boolean;
    getters?: GetterTree<S, R>;
    state?: S | (() => S);
    mutations?: MutationTree<S>;
    actions?: ActionTree<S, R>;
    context: ActionContext<S, R>;
    constructor(module: Mod<S, any>);
}
declare type ConstructorOf<C> = {
    new (...args: any[]): C;
};
export declare function getModule<M extends VuexModule>(moduleClass: ConstructorOf<M>, store?: Store<any>): M;
export {};
