import { Handler, Middleware, RequestMapFunc, RequestMapper, RequestMethod } from "../server/request";
export declare type RouterMeta = {
    globalPath: string;
    request: Map<String, Handler>;
    middlewares: Map<String, Middleware>;
};
export declare class Router implements RequestMethod {
    private readonly requestMap;
    private readonly middlewares;
    private readonly requestMapFunc;
    private localRequestMap;
    private localMiddlewares;
    constructor(requestMap: RequestMapper, middlewares: Middleware[], requestMapFunc: RequestMapFunc);
    get(path: string, ...handlers: Handler[]): void;
    post(path: string, ...handlers: Handler[]): void;
    put(path: string, ...handlers: Handler[]): void;
    delete(path: string, ...handlers: Handler[]): void;
    use(middleware: Handler): void;
    attach(globalPath: string): void;
    options(path: string, ...handlers: Handler[]): void;
    private delegate;
    private submitToMap;
}
