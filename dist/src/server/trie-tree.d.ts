import { Handler } from "./request";
export declare class TrieTree<k extends string, v extends Handler> {
    private readonly root;
    constructor();
    get(path: string): TrieLeaf<k, v>;
    insert(path: string, value: v): void;
    private dig;
}
export interface TrieLeaf<k, v> {
    node: Node<k, v> | null;
    routeParams: {
        [key: string]: any;
    };
}
declare class Node<k, v> {
    private readonly path?;
    private readonly handlers;
    private readonly children;
    constructor(path?: string);
    insertChild(handler: Handler): void;
    getChildren(): Node<k, v>[];
    getHandlers(): Handler[];
    getPath(): string;
}
export {};
