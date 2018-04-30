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
function actionDecoratorFactory(params) {
    return function (target, key, descriptor) {
        const module = target.constructor;
        if (!module.actions) {
            module.actions = {};
        }
        const actionFunction = descriptor.value;
        const action = function (context, payload) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const actionPayload = yield actionFunction.call(context, [payload]);
                    if (params) {
                        if (params.commit) {
                            context.commit(params.commit, actionPayload);
                        }
                    }
                }
                catch (e) {
                    console.error('Could not perform action ' + key.toString());
                    console.error(e);
                }
            });
        };
        module.actions[key] = action;
    };
}
function Action(targetOrParams, key, descriptor) {
    if (!key && !descriptor) {
        return actionDecoratorFactory(targetOrParams);
    }
    else {
        actionDecoratorFactory()(targetOrParams, key, descriptor);
    }
}
exports.Action = Action;
//# sourceMappingURL=action.js.map