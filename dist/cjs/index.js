'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Takes the properties on object from parameter source and adds them to the object
 * parameter target
 * @param {object} target  Object to have properties copied onto from y
 * @param {object} source  Object with properties to be copied to x
 */
function addPropertiesToObject(target, source) {
    for (let k of Object.keys(source || {})) {
        Object.defineProperty(target, k, {
            get: () => source[k]
        });
    }
}
/**
 * Returns a namespaced name of the module to be used as a store getter
 * @param module
 */
function getModuleName(module) {
    if (!module._vmdModuleName) {
        throw new Error(`ERR_GET_MODULE_NAME : Could not get module accessor.
      Make sure your module has name, we can't make accessors for unnamed modules
      i.e. @Module({ name: 'something' })`);
    }
    return `vuexModuleDecorators/${module._vmdModuleName}`;
}

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
function getModule(moduleClass, store) {
    const moduleName = getModuleName(moduleClass);
    if (store && store.getters[moduleName]) {
        return store.getters[moduleName];
    }
    else if (moduleClass._statics) {
        return moduleClass._statics;
    }
    const genStatic = moduleClass._genStatic;
    if (!genStatic) {
        throw new Error(`ERR_GET_MODULE_NO_STATICS : Could not get module accessor.
      Make sure your module has name, we can't make accessors for unnamed modules
      i.e. @Module({ name: 'something' })`);
    }
    const storeModule = genStatic(store);
    if (store) {
        store.getters[moduleName] = storeModule;
    }
    else {
        moduleClass._statics = storeModule;
    }
    return storeModule;
}

const reservedKeys = ['actions', 'getters', 'mutations', 'modules', 'state', 'namespaced', 'commit'];
function stateFactory(module) {
    const state = new module.prototype.constructor({});
    const s = {};
    Object.keys(state).forEach((key) => {
        if (reservedKeys.indexOf(key) !== -1) {
            if (typeof state[key] !== 'undefined') {
                throw new Error(`ERR_RESERVED_STATE_KEY_USED: You cannot use the following
        ['actions', 'getters', 'mutations', 'modules', 'state', 'namespaced', 'commit']
        as fields in your module. These are reserved as they have special purpose in Vuex`);
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

function staticStateGenerator(module, modOpt, statics) {
    const state = modOpt.stateFactory ? module.state() : module.state;
    Object.keys(state).forEach((key) => {
        if (state.hasOwnProperty(key)) {
            // If not undefined or function means it is a state value
            if (['undefined', 'function'].indexOf(typeof state[key]) === -1) {
                Object.defineProperty(statics, key, {
                    get() {
                        const path = modOpt.name.split('/');
                        let data = statics.store.state;
                        for (let segment of path) {
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
    Object.keys(module.getters).forEach((key) => {
        if (module.namespaced) {
            Object.defineProperty(statics, key, {
                get() {
                    return statics.store.getters[`${modOpt.name}/${key}`];
                }
            });
        }
        else {
            Object.defineProperty(statics, key, {
                get() {
                    return statics.store.getters[key];
                }
            });
        }
    });
}
function staticMutationGenerator(module, modOpt, statics) {
    Object.keys(module.mutations).forEach((key) => {
        if (module.namespaced) {
            statics[key] = function (...args) {
                statics.store.commit(`${modOpt.name}/${key}`, ...args);
            };
        }
        else {
            statics[key] = function (...args) {
                statics.store.commit(key, ...args);
            };
        }
    });
}
function staticActionGenerators(module, modOpt, statics) {
    Object.keys(module.actions).forEach((key) => {
        if (module.namespaced) {
            statics[key] = async function (...args) {
                return statics.store.dispatch(`${modOpt.name}/${key}`, ...args);
            };
        }
        else {
            statics[key] = async function (...args) {
                return statics.store.dispatch(key, ...args);
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
    Object.getOwnPropertyNames(srcModule.prototype).forEach((funcName) => {
        const descriptor = Object.getOwnPropertyDescriptor(srcModule.prototype, funcName);
        if (descriptor.get && targetModule.getters) {
            targetModule.getters[funcName] = function (state, getters, rootState, rootGetters) {
                const thisObj = { context: { state, getters, rootState, rootGetters } };
                addPropertiesToObject(thisObj, state);
                addPropertiesToObject(thisObj, getters);
                const got = descriptor.get.call(thisObj);
                return got;
            };
        }
    });
}
function moduleDecoratorFactory(moduleOptions) {
    return function (constructor) {
        const module = constructor;
        const stateFactory$1 = () => stateFactory(module);
        if (!module.state) {
            module.state = moduleOptions && moduleOptions.stateFactory ? stateFactory$1 : stateFactory$1();
        }
        if (!module.getters) {
            module.getters = {};
        }
        if (!module.namespaced) {
            module.namespaced = moduleOptions && moduleOptions.namespaced;
        }
        let parentModule = Object.getPrototypeOf(module);
        while (parentModule.name !== 'VuexModule' && parentModule.name !== '') {
            addGettersToModule(module, parentModule);
            parentModule = Object.getPrototypeOf(parentModule);
        }
        addGettersToModule(module, module);
        const modOpt = moduleOptions;
        if (modOpt.name) {
            Object.defineProperty(constructor, '_genStatic', {
                value: (store) => {
                    let statics = { store: store || modOpt.store };
                    if (!statics.store) {
                        throw new Error(`ERR_STORE_NOT_PROVIDED: To use getModule(), either the module
            should be decorated with store in decorator, i.e. @Module({store: store}) or
            store should be passed when calling getModule(), i.e. getModule(MyModule, this.$store)`);
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

const config = {};

function actionDecoratorFactory(params) {
    const { commit = undefined, rawError = !!config.rawError, root = false } = params || {};
    return function (target, key, descriptor) {
        const module = target.constructor;
        if (!module.hasOwnProperty('actions')) {
            module.actions = Object.assign({}, module.actions);
        }
        const actionFunction = descriptor.value;
        const action = async function (context, payload) {
            try {
                let actionPayload = null;
                if (module._genStatic) {
                    const moduleName = getModuleName(module);
                    const moduleAccessor = context.rootGetters[moduleName]
                        ? context.rootGetters[moduleName]
                        : getModule(module);
                    moduleAccessor.context = context;
                    actionPayload = await actionFunction.call(moduleAccessor, payload);
                }
                else {
                    const thisObj = { context };
                    addPropertiesToObject(thisObj, context.state);
                    addPropertiesToObject(thisObj, context.getters);
                    actionPayload = await actionFunction.call(thisObj, payload);
                }
                if (commit) {
                    context.commit(commit, actionPayload);
                }
                return actionPayload;
            }
            catch (e) {
                throw rawError
                    ? e
                    : new Error('ERR_ACTION_ACCESS_UNDEFINED: Are you trying to access ' +
                        'this.someMutation() or this.someGetter inside an @Action? \n' +
                        'That works only in dynamic modules. \n' +
                        'If not dynamic use this.context.commit("mutationName", payload) ' +
                        'and this.context.getters["getterName"]' +
                        '\n' +
                        new Error(`Could not perform action ${key.toString()}`).stack +
                        '\n' +
                        e.stack);
            }
        };
        module.actions[key] = root ? { root, handler: action } : action;
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
    const module = target.constructor;
    if (!module.hasOwnProperty('mutations')) {
        module.mutations = Object.assign({}, module.mutations);
    }
    const mutationFunction = descriptor.value;
    const mutation = function (state, payload) {
        mutationFunction.call(state, payload);
    };
    module.mutations[key] = mutation;
}

function mutationActionDecoratorFactory(params) {
    return function (target, key, descriptor) {
        const module = target.constructor;
        if (!module.hasOwnProperty('mutations')) {
            module.mutations = Object.assign({}, module.mutations);
        }
        if (!module.hasOwnProperty('actions')) {
            module.actions = Object.assign({}, module.actions);
        }
        const mutactFunction = descriptor.value;
        const action = async function (context, payload) {
            try {
                const thisObj = { context };
                addPropertiesToObject(thisObj, context.state);
                addPropertiesToObject(thisObj, context.getters);
                const actionPayload = await mutactFunction.call(thisObj, payload);
                if (actionPayload === undefined)
                    return;
                context.commit(key, actionPayload);
            }
            catch (e) {
                if (params.rawError) {
                    throw e;
                }
                else {
                    console.error('Could not perform action ' + key.toString());
                    console.error(e);
                    return Promise.reject(e);
                }
            }
        };
        const mutation = function (state, payload) {
            if (!params.mutate) {
                params.mutate = Object.keys(payload);
            }
            for (let stateItem of params.mutate) {
                if (state.hasOwnProperty(stateItem) && payload.hasOwnProperty(stateItem)) {
                    state[stateItem] = payload[stateItem];
                }
                else {
                    throw new Error(`ERR_MUTATE_PARAMS_NOT_IN_PAYLOAD
          In @MutationAction, mutate: ['a', 'b', ...] array keys must
          match with return type = {a: {}, b: {}, ...} and must
          also be in state.`);
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
