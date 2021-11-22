import { Module as Mod } from 'vuex';
import { ModuleOptions } from '../moduleoptions';
export declare function Module<S>(module: Function & Mod<S, any>): void;
export declare function Module<S>(options: ModuleOptions): ClassDecorator;
