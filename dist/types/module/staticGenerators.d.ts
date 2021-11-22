import { Module as Mod } from 'vuex';
import { DynamicModuleOptions } from '../moduleoptions';
export declare function staticStateGenerator<S extends Object>(module: Function & Mod<S, any>, modOpt: DynamicModuleOptions, statics: any): void;
export declare function staticGetterGenerator<S>(module: Function & Mod<S, any>, modOpt: DynamicModuleOptions, statics: any): void;
export declare function staticMutationGenerator<S>(module: Function & Mod<S, any>, modOpt: DynamicModuleOptions, statics: any): void;
export declare function staticActionGenerators<S>(module: Function & Mod<S, any>, modOpt: DynamicModuleOptions, statics: any): void;
