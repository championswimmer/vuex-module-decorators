"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Mutation(target, key, descriptor) {
    const module = target.constructor;
    if (!module.mutations) {
        module.mutations = {};
    }
    const mutationFunction = descriptor.value;
    const mutation = function (state, payload) {
        mutationFunction.call(state, [payload]);
    };
    module.mutations[key] = mutation;
}
exports.Mutation = Mutation;
//# sourceMappingURL=mutation.js.map