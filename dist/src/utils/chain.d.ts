import { BunRequest, Middleware } from "../server/request";
import { BunResponse } from "../server/response";
export declare function Chain(req: BunRequest, res: BunResponse, middlewares: Middleware[]): void;
