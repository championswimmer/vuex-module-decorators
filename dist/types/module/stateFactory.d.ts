import { Module as Mod } from 'vuex';
export declare function stateFactory<S>(module: Function & Mod<S, any>): S;
