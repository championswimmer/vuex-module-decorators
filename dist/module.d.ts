import { ActionTree, GetterTree, Module as Mod, ModuleTree, MutationTree } from 'vuex';
export declare class VuexModule<S = ThisType<S>, R = any> implements Mod<S, R> {
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
    constructor(module: Mod<S, any>);
}
/**
 * `@Module` decorator
 * @param {Function & Module<S, any>} module
 * @constructor
 */
export declare function Module<S>(module: Function & Mod<S, any>): void;
