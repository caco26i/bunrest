"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const response_1 = require("./response");
const router_1 = require("../router/router");
const chain_1 = require("../utils/chain");
const trie_tree_1 = require("./trie-tree");
// import { encodeBase64 } from "../utils/base64";
function server() {
    return BunServer.instance;
}
exports.server = server;
class BunServer {
    // singleton bun server
    static server;
    constructor() {
        if (BunServer.server) {
            throw new Error("DONT use this constructor to create bun server, try Server()");
        }
        BunServer.server = this;
    }
    static get instance() {
        return BunServer.server ?? (BunServer.server = new BunServer());
    }
    requestMap = {};
    middlewares = [];
    errorHandlers = [];
    get(path, ...handlers) {
        this.delegate(path, "GET", handlers);
    }
    put(path, ...handlers) {
        this.delegate(path, "PUT", handlers);
    }
    post(path, ...handlers) {
        this.delegate(path, "POST", handlers);
    }
    delete(path, ...handlers) {
        this.delegate(path, "DELETE", handlers);
    }
    options(path, ...handlers) {
        this.delegate(path, "OPTIONS", handlers);
    }
    /**
     * Attch middleware or router or global error handler
     * @param arg1
     * @param arg2
     */
    use(arg1, arg2) {
        // pass router
        if (arg2 && typeof arg1 === "string") {
            arg2.attach(arg1);
        }
        // pass middleware or global error handler
        else {
            if (arg1.length === 3) {
                this.middlewares.push({
                    path: "/",
                    middlewareFunc: arg1,
                });
            }
            else if (arg1.length === 4) {
                this.errorHandlers.push(arg1);
            }
        }
    }
    router() {
        return new router_1.Router(this.requestMap, this.middlewares, this.submitToMap);
    }
    listen(port, callback, options) {
        const baseUrl = "http://localhost:" + port;
        callback?.call(null);
        return this.openServer(port, baseUrl, options);
    }
    openServer(port, baseUrl, options) {
        const that = this;
        return Bun.serve({
            port,
            keyFile: options?.keyFile,
            certFile: options?.certFile,
            passphrase: options?.passphrase,
            caFile: options?.caFile,
            dhParamsFile: options?.dhParamsFile,
            lowMemoryMode: options?.lowMemoryMode,
            development: process.env.SERVER_ENV !== "production",
            async fetch(req1) {
                const req = await that.bunRequest(req1);
                const res = that.responseProxy();
                const tree = that.requestMap[req.method.toLowerCase()];
                const leaf = tree.get(req.path);
                const handlers = leaf.node?.getHandlers();
                // append req route params
                req.params = leaf.routeParams;
                if (that.middlewares.length !== 0) {
                    const plainMid = that.middlewares.filter((mid) => mid.path === "/");
                    const chain = new chain_1.Chain(req, res, plainMid);
                    chain.next();
                    if (res.isReady()) {
                        return res.getResponse();
                    }
                    if (!chain.isFinish()) {
                        throw new Error("Please call next() at the end of your middleware");
                    }
                }
                const middlewares = [];
                for (let i = that.middlewares.length - 1; i >= 0; --i) {
                    const target = that.middlewares[i];
                    if (target.path === "/") {
                        continue;
                    }
                    if (target.path === req.path) {
                        middlewares.push(target);
                        break;
                    }
                }
                if (middlewares.length !== 0) {
                    const chain = new chain_1.Chain(req, res, middlewares);
                    chain.next();
                    if (res.isReady()) {
                        return res.getResponse();
                    }
                    if (!chain.isFinish()) {
                        throw new Error("Please call next() at the end of your middleware");
                    }
                }
                if (handlers) {
                    handlers.forEach((h) => {
                        h.apply(that, [req, res]);
                    });
                }
                else {
                    // cannot find path
                    throw new Error(`Cannot find path on ${req.path}`);
                }
                return res.getResponse();
            },
            error(err) {
                const res = that.responseProxy();
                // basically, next here is to ignore the error
                const next = () => { };
                that.errorHandlers.forEach((handler) => {
                    // * no request object pass to error handler
                    handler.apply(that, [null, res, err, next]);
                });
                if (res.isReady()) {
                    return res.getResponse();
                }
                throw err;
            },
        });
    }
    async bunRequest(req) {
        const { searchParams, pathname } = new URL(req.url);
        const newReq = {
            method: req.method,
            path: pathname,
            request: req,
            query: {},
            params: {},
            headers: {},
        };
        // append query params
        searchParams.forEach((v, k) => {
            newReq.query[k] = v;
        });
        // append body
        const body = await req.json();
        req.arrayBuffer;
        newReq.body = body;
        newReq.blob = req.blob();
        // append headers
        req.headers.forEach((v, k) => {
            newReq.headers[k] = v;
        });
        return newReq;
    }
    responseProxy() {
        const bunResponse = new response_1.BunResponse();
        return new Proxy(bunResponse, {
            get(target, prop, receiver) {
                if (typeof target[prop] === "function" &&
                    (prop === "json" || prop === "send") &&
                    target.isReady()) {
                    throw new Error("You cannot send response twice");
                }
                else {
                    return Reflect.get(target, prop, receiver);
                }
            },
        });
    }
    delegate(path, method, handlers) {
        const key = path;
        for (let i = 0; i < handlers.length; ++i) {
            const handler = handlers[i];
            if (i == handlers.length - 1) {
                this.submitToMap(method.toLowerCase(), path, handler);
                break;
            }
            this.middlewares.push({
                path: key,
                middlewareFunc: handler,
            });
        }
    }
    submitToMap(method, path, handler) {
        console.log(path);
        let targetTree = this.requestMap[method];
        if (!targetTree) {
            this.requestMap[method] = new trie_tree_1.TrieTree();
            targetTree = this.requestMap[method];
        }
        targetTree.insert(path, handler);
    }
}
