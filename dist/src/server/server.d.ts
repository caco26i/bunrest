import { Server } from "bun";
import { RequestMethod, Handler, SSLOptions } from "./request";
import { Router } from "../router/router";
export declare function server(): BunServer;
declare class BunServer implements RequestMethod {
    private static server?;
    constructor();
    static get instance(): BunServer;
    private readonly requestMap;
    private readonly middlewares;
    private readonly errorHandlers;
    get(path: string, ...handlers: Handler[]): void;
    put(path: string, ...handlers: Handler[]): void;
    post(path: string, ...handlers: Handler[]): void;
    delete(path: string, ...handlers: Handler[]): void;
    options(path: string, ...handlers: Handler[]): void;
    /**
     * Add middleware
     * @param middleware
     */
    use(middleware: Handler): void;
    /**
     * Attach router
     * @param path
     * @param router
     */
    use(path: string, router: Router): void;
    router(): Router;
    listen(port: string | number, callback?: () => void, options?: SSLOptions): Server;
    private openServer;
    private bunRequest;
    private responseProxy;
    private delegate;
    private submitToMap;
}
export {};
