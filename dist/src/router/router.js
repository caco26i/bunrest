"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const path_1 = __importDefault(require("path"));
class Router {
    requestMap;
    middlewares;
    requestMapFunc;
    localRequestMap = {};
    localMiddlewares = [];
    constructor(requestMap, middlewares, requestMapFunc) {
        this.requestMap = requestMap;
        this.requestMapFunc = requestMapFunc;
        this.middlewares = middlewares;
    }
    get(path, ...handlers) {
        this.delegate(path, "GET", handlers);
    }
    post(path, ...handlers) {
        this.delegate(path, "POST", handlers);
    }
    put(path, ...handlers) {
        this.delegate(path, "PUT", handlers);
    }
    delete(path, ...handlers) {
        this.delegate(path, "DELETE", handlers);
    }
    use(middleware) {
        this.localMiddlewares.push({
            path: "/",
            middlewareFunc: middleware,
        });
    }
    attach(globalPath) {
        this.localMiddlewares.forEach((mid) => {
            this.middlewares.push({
                path: path_1.default.join(globalPath, mid.path),
                middlewareFunc: mid.middlewareFunc,
            });
        });
        for (const k in this.localRequestMap) {
            const method = k;
            const reqArr = this.localRequestMap[k];
            reqArr.forEach((v, _) => {
                this.requestMapFunc.apply(this, [method, path_1.default.join(globalPath, v.path), v.handler]);
            });
        }
    }
    options(path, ...handlers) {
        this.delegate(path, "OPTIONS", handlers);
    }
    delegate(localPath, method, handlers) {
        for (let i = 0; i < handlers.length; ++i) {
            const handler = handlers[i];
            if (i == handlers.length - 1) {
                this.submitToMap(method.toLowerCase(), localPath, handler);
                break;
            }
            this.localMiddlewares.push({
                path: localPath,
                middlewareFunc: handler,
            });
        }
    }
    submitToMap(method, path, handler) {
        let targetMap = this.localRequestMap[method];
        if (!targetMap) {
            this.localRequestMap[method] = [];
            targetMap = this.localRequestMap[method];
        }
        targetMap.push({
            path,
            handler,
        });
    }
}
exports.Router = Router;
