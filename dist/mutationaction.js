"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function MutationAction(params) {
    return function (target, key, descriptor) {
        const module = target.constructor;
        if (!module.mutations) {
            module.mutations = {};
        }
        if (!module.actions) {
            module.actions = {};
        }
        const mutactFunction = descriptor.value;
        const action = function (context, payload) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const actionPayload = yield mutactFunction.call(context, [payload]);
                    context.commit(key, actionPayload);
                }
                catch (e) {
                    console.error('Could not perform action ' + key.toString());
                    console.error(e);
                }
            });
        };
        const mutation = function (state, payload) {
            for (let stateItem of params.mutate) {
                if (state[stateItem] != null && payload[stateItem] != null) {
                    state[stateItem] = payload[stateItem];
                }
            }
        };
        module.actions[key] = action;
        module.mutations[key] = mutation;
    };
}
exports.MutationAction = MutationAction;
//# sourceMappingURL=mutationaction.js.map