"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vuex_1 = __importDefault(require("vuex"));
const vue_1 = __importDefault(require("vue"));
vue_1.default.use(vuex_1.default);
const dist_1 = require("../dist");
const chai_1 = require("chai");
let MyModule = class MyModule extends dist_1.VuexModule {
    constructor() {
        super(...arguments);
        this.count = 0;
    }
    updateCount(newcount) {
        return __awaiter(this, void 0, void 0, function* () {
            return { count: newcount };
        });
    }
};
__decorate([
    dist_1.MutationAction({ mutate: ['count'] })
], MyModule.prototype, "updateCount", null);
MyModule = __decorate([
    dist_1.Module
], MyModule);
const store = new vuex_1.default.Store({
    modules: {
        mm: MyModule
    }
});
describe('dispatching moduleaction works', () => {
    it('should update count', function (done) {
        store.dispatch('updateCount', 2).then(() => {
            chai_1.expect(parseInt(store.state.mm.count)).to.equal(2);
            done();
        }).catch(done);
    });
});
