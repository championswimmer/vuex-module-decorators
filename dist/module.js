"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VuexModule {
    constructor(module) {
        this.actions = module.actions;
        this.mutations = module.mutations;
        this.state = module.state;
        this.getters = module.getters;
        this.namespaced = module.namespaced;
        this.modules = module.modules;
    }
}
exports.VuexModule = VuexModule;
/**
 * `@Module` decorator
 * @param {Function & Module<S, any>} module
 * @constructor
 */
function Module(module) {
    const state = new (module.prototype.constructor)({});
    if (!module.state) {
        module.state = {};
    }
    Object.keys(state).forEach((key) => {
        if (state.hasOwnProperty(key) && typeof state[key] !== 'function') {
            module.state[key] = state[key];
        }
    });
}
exports.Module = Module;
//# sourceMappingURL=module.js.map