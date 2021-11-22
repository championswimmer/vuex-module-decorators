'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Takes the properties on object from parameter source and adds them to the object
 * parameter target
 * @param {object} target  Object to have properties copied onto from y
 * @param {object} source  Object with properties to be copied to x
 */
function addPropertiesToObject(target, source) {
    var _loop_1 = function (k) {
        Object.defineProperty(target, k, {
            get: function () { return source[k]; }
        });
    };
    for (var _i = 0, _a = Object.keys(source || {}); _i < _a.length; _i++) {
        var k = _a[_i];
        _loop_1(k);
    }
}
/**
 * Returns a namespaced name of the module to be used as a store getter
 * @param module
 */
function getModuleName(module) {
    if (!module._vmdModuleName) {
        throw new Error("ERR_GET_MODULE_NAME : Could not get module accessor.\n      Make sure your module has name, we can't make accessors for unnamed modules\n      i.e. @Module({ name: 'something' })");
    }
    return "vuexModuleDecorators/".concat(module._vmdModuleName);
}

var VuexModule = /** @class */ (function () {
    function VuexModule(module) {
        this.actions = module.actions;
        this.mutations = module.mutations;
        this.state = module.state;
        this.getters = module.getters;
        this.namespaced = module.namespaced;
        this.modules = module.modules;
    }
    return VuexModule;
}());
function getModule(moduleClass, store) {
    var moduleName = getModuleName(moduleClass);
    if (store && store.getters[moduleName]) {
        return store.getters[moduleName];
    }
    else if (moduleClass._statics) {
        return moduleClass._statics;
    }
    var genStatic = moduleClass._genStatic;
    if (!genStatic) {
        throw new Error("ERR_GET_MODULE_NO_STATICS : Could not get module accessor.\n      Make sure your module has name, we can't make accessors for unnamed modules\n      i.e. @Module({ name: 'something' })");
    }
    var storeModule = genStatic(store);
    if (store) {
        store.getters[moduleName] = storeModule;
    }
    else {
        moduleClass._statics = storeModule;
    }
    return storeModule;
}

var reservedKeys = ['actions', 'getters', 'mutations', 'modules', 'state', 'namespaced', 'commit'];
function stateFactory(module) {
    var state = new module.prototype.constructor({});
    var s = {};
    Object.keys(state).forEach(function (key) {
        if (reservedKeys.indexOf(key) !== -1) {
            if (typeof state[key] !== 'undefined') {
                throw new Error("ERR_RESERVED_STATE_KEY_USED: You cannot use the following\n        ['actions', 'getters', 'mutations', 'modules', 'state', 'namespaced', 'commit']\n        as fields in your module. These are reserved as they have special purpose in Vuex");
            }
            return;
        }
        if (state.hasOwnProperty(key)) {
            if (typeof state[key] !== 'function') {
                s[key] = state[key];
            }
        }
    });
    return s;
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function staticStateGenerator(module, modOpt, statics) {
    var state = modOpt.stateFactory ? module.state() : module.state;
    Object.keys(state).forEach(function (key) {
        if (state.hasOwnProperty(key)) {
            // If not undefined or function means it is a state value
            if (['undefined', 'function'].indexOf(typeof state[key]) === -1) {
                Object.defineProperty(statics, key, {
                    get: function () {
                        var path = modOpt.name.split('/');
                        var data = statics.store.state;
                        for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
                            var segment = path_1[_i];
                            data = data[segment];
                        }
                        return data[key];
                    }
                });
            }
        }
    });
}
function staticGetterGenerator(module, modOpt, statics) {
    Object.keys(module.getters).forEach(function (key) {
        if (module.namespaced) {
            Object.defineProperty(statics, key, {
                get: function () {
                    return statics.store.getters["".concat(modOpt.name, "/").concat(key)];
                }
            });
        }
        else {
            Object.defineProperty(statics, key, {
                get: function () {
                    return statics.store.getters[key];
                }
            });
        }
    });
}
function staticMutationGenerator(module, modOpt, statics) {
    Object.keys(module.mutations).forEach(function (key) {
        if (module.namespaced) {
            statics[key] = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = statics.store).commit.apply(_a, __spreadArray(["".concat(modOpt.name, "/").concat(key)], args, false));
            };
        }
        else {
            statics[key] = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = statics.store).commit.apply(_a, __spreadArray([key], args, false));
            };
        }
    });
}
function staticActionGenerators(module, modOpt, statics) {
    Object.keys(module.actions).forEach(function (key) {
        if (module.namespaced) {
            statics[key] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return __awaiter(this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        return [2 /*return*/, (_a = statics.store).dispatch.apply(_a, __spreadArray(["".concat(modOpt.name, "/").concat(key)], args, false))];
                    });
                });
            };
        }
        else {
            statics[key] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return __awaiter(this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        return [2 /*return*/, (_a = statics.store).dispatch.apply(_a, __spreadArray([key], args, false))];
                    });
                });
            };
        }
    });
}

function registerDynamicModule(module, modOpt) {
    if (!modOpt.name) {
        throw new Error('Name of module not provided in decorator options');
    }
    if (!modOpt.store) {
        throw new Error('Store not provided in decorator options when using dynamic option');
    }
    modOpt.store.registerModule(modOpt.name, // TODO: Handle nested modules too in future
    module, { preserveState: modOpt.preserveState || false });
}
function addGettersToModule(targetModule, srcModule) {
    Object.getOwnPropertyNames(srcModule.prototype).forEach(function (funcName) {
        var descriptor = Object.getOwnPropertyDescriptor(srcModule.prototype, funcName);
        if (descriptor.get && targetModule.getters) {
            targetModule.getters[funcName] = function (state, getters, rootState, rootGetters) {
                var thisObj = { context: { state: state, getters: getters, rootState: rootState, rootGetters: rootGetters } };
                addPropertiesToObject(thisObj, state);
                addPropertiesToObject(thisObj, getters);
                var got = descriptor.get.call(thisObj);
                return got;
            };
        }
    });
}
function moduleDecoratorFactory(moduleOptions) {
    return function (constructor) {
        var module = constructor;
        var stateFactory$1 = function () { return stateFactory(module); };
        if (!module.state) {
            module.state = moduleOptions && moduleOptions.stateFactory ? stateFactory$1 : stateFactory$1();
        }
        if (!module.getters) {
            module.getters = {};
        }
        if (!module.namespaced) {
            module.namespaced = moduleOptions && moduleOptions.namespaced;
        }
        var parentModule = Object.getPrototypeOf(module);
        while (parentModule.name !== 'VuexModule' && parentModule.name !== '') {
            addGettersToModule(module, parentModule);
            parentModule = Object.getPrototypeOf(parentModule);
        }
        addGettersToModule(module, module);
        var modOpt = moduleOptions;
        if (modOpt.name) {
            Object.defineProperty(constructor, '_genStatic', {
                value: function (store) {
                    var statics = { store: store || modOpt.store };
                    if (!statics.store) {
                        throw new Error("ERR_STORE_NOT_PROVIDED: To use getModule(), either the module\n            should be decorated with store in decorator, i.e. @Module({store: store}) or\n            store should be passed when calling getModule(), i.e. getModule(MyModule, this.$store)");
                    }
                    // ===========  For statics ==============
                    // ------ state -------
                    staticStateGenerator(module, modOpt, statics);
                    // ------- getters -------
                    if (module.getters) {
                        staticGetterGenerator(module, modOpt, statics);
                    }
                    // -------- mutations --------
                    if (module.mutations) {
                        staticMutationGenerator(module, modOpt, statics);
                    }
                    // -------- actions ---------
                    if (module.actions) {
                        staticActionGenerators(module, modOpt, statics);
                    }
                    return statics;
                }
            });
            Object.defineProperty(constructor, '_vmdModuleName', {
                value: modOpt.name
            });
        }
        if (modOpt.dynamic) {
            registerDynamicModule(module, modOpt);
        }
        return constructor;
    };
}
function Module(modOrOpt) {
    if (typeof modOrOpt === 'function') {
        /*
         * @Module decorator called without options (directly on the class definition)
         */
        moduleDecoratorFactory({})(modOrOpt);
    }
    else {
        /*
         * @Module({...}) decorator called with options
         */
        return moduleDecoratorFactory(modOrOpt);
    }
}

var config = {};

function actionDecoratorFactory(params) {
    var _a = params || {}, _b = _a.commit, commit = _b === void 0 ? undefined : _b, _c = _a.rawError, rawError = _c === void 0 ? !!config.rawError : _c, _d = _a.root, root = _d === void 0 ? false : _d;
    return function (target, key, descriptor) {
        var module = target.constructor;
        if (!module.hasOwnProperty('actions')) {
            module.actions = Object.assign({}, module.actions);
        }
        var actionFunction = descriptor.value;
        var action = function (context, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var actionPayload, moduleName, moduleAccessor, thisObj, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            actionPayload = null;
                            if (!module._genStatic) return [3 /*break*/, 2];
                            moduleName = getModuleName(module);
                            moduleAccessor = context.rootGetters[moduleName]
                                ? context.rootGetters[moduleName]
                                : getModule(module);
                            moduleAccessor.context = context;
                            return [4 /*yield*/, actionFunction.call(moduleAccessor, payload)];
                        case 1:
                            actionPayload = _a.sent();
                            return [3 /*break*/, 4];
                        case 2:
                            thisObj = { context: context };
                            addPropertiesToObject(thisObj, context.state);
                            addPropertiesToObject(thisObj, context.getters);
                            return [4 /*yield*/, actionFunction.call(thisObj, payload)];
                        case 3:
                            actionPayload = _a.sent();
                            _a.label = 4;
                        case 4:
                            if (commit) {
                                context.commit(commit, actionPayload);
                            }
                            return [2 /*return*/, actionPayload];
                        case 5:
                            e_1 = _a.sent();
                            throw rawError
                                ? e_1
                                : new Error('ERR_ACTION_ACCESS_UNDEFINED: Are you trying to access ' +
                                    'this.someMutation() or this.someGetter inside an @Action? \n' +
                                    'That works only in dynamic modules. \n' +
                                    'If not dynamic use this.context.commit("mutationName", payload) ' +
                                    'and this.context.getters["getterName"]' +
                                    '\n' +
                                    new Error("Could not perform action ".concat(key.toString())).stack +
                                    '\n' +
                                    e_1.stack);
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        module.actions[key] = root ? { root: root, handler: action } : action;
    };
}
/**
 * The @Action decorator turns an async function into an Vuex action
 *
 * @param targetOrParams the module class
 * @param key name of the action
 * @param descriptor the action function descriptor
 * @constructor
 */
function Action(targetOrParams, key, descriptor) {
    if (!key && !descriptor) {
        /*
         * This is the case when `targetOrParams` is params.
         * i.e. when used as -
         * <pre>
            @Action({commit: 'incrCount'})
            async getCountDelta() {
              return 5
            }
         * </pre>
         */
        return actionDecoratorFactory(targetOrParams);
    }
    else {
        /*
         * This is the case when @Action is called on action function
         * without any params
         * <pre>
         *   @Action
         *   async doSomething() {
         *    ...
         *   }
         * </pre>
         */
        actionDecoratorFactory()(targetOrParams, key, descriptor);
    }
}

function Mutation(target, key, descriptor) {
    var module = target.constructor;
    if (!module.hasOwnProperty('mutations')) {
        module.mutations = Object.assign({}, module.mutations);
    }
    var mutationFunction = descriptor.value;
    var mutation = function (state, payload) {
        mutationFunction.call(state, payload);
    };
    module.mutations[key] = mutation;
}

function mutationActionDecoratorFactory(params) {
    return function (target, key, descriptor) {
        var module = target.constructor;
        if (!module.hasOwnProperty('mutations')) {
            module.mutations = Object.assign({}, module.mutations);
        }
        if (!module.hasOwnProperty('actions')) {
            module.actions = Object.assign({}, module.actions);
        }
        var mutactFunction = descriptor.value;
        var action = function (context, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var thisObj, actionPayload, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            thisObj = { context: context };
                            addPropertiesToObject(thisObj, context.state);
                            addPropertiesToObject(thisObj, context.getters);
                            return [4 /*yield*/, mutactFunction.call(thisObj, payload)];
                        case 1:
                            actionPayload = _a.sent();
                            if (actionPayload === undefined)
                                return [2 /*return*/];
                            context.commit(key, actionPayload);
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _a.sent();
                            if (params.rawError) {
                                throw e_1;
                            }
                            else {
                                console.error('Could not perform action ' + key.toString());
                                console.error(e_1);
                                return [2 /*return*/, Promise.reject(e_1)];
                            }
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        var mutation = function (state, payload) {
            if (!params.mutate) {
                params.mutate = Object.keys(payload);
            }
            for (var _i = 0, _a = params.mutate; _i < _a.length; _i++) {
                var stateItem = _a[_i];
                if (state.hasOwnProperty(stateItem) && payload.hasOwnProperty(stateItem)) {
                    state[stateItem] = payload[stateItem];
                }
                else {
                    throw new Error("ERR_MUTATE_PARAMS_NOT_IN_PAYLOAD\n          In @MutationAction, mutate: ['a', 'b', ...] array keys must\n          match with return type = {a: {}, b: {}, ...} and must\n          also be in state.");
                }
            }
        };
        module.actions[key] = params.root ? { root: true, handler: action } : action;
        module.mutations[key] = mutation;
    };
}
/**
 * The @MutationAction decorator turns this into an action that further calls a mutation
 * Both the action and the mutation are generated for you
 *
 * @param paramsOrTarget the params or the target class
 * @param key the name of the function
 * @param descriptor the function body
 * @constructor
 */
function MutationAction(paramsOrTarget, key, descriptor) {
    if (!key && !descriptor) {
        /*
         * This is the case when `paramsOrTarget` is params.
         * i.e. when used as -
         * <pre>
            @MutationAction({mutate: ['incrCount']})
            async getCountDelta() {
              return {incrCount: 5}
            }
         * </pre>
         */
        return mutationActionDecoratorFactory(paramsOrTarget);
    }
    else {
        /*
         * This is the case when `paramsOrTarget` is target.
         * i.e. when used as -
         * <pre>
            @MutationAction
            async getCountDelta() {
              return {incrCount: 5}
            }
         * </pre>
         */
        mutationActionDecoratorFactory({})(paramsOrTarget, key, descriptor);
    }
}

exports.Action = Action;
exports.Module = Module;
exports.Mutation = Mutation;
exports.MutationAction = MutationAction;
exports.VuexModule = VuexModule;
exports.config = config;
exports.getModule = getModule;
//# sourceMappingURL=index.js.map
