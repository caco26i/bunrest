"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrieTree = void 0;
//import { encodeBase64, decodeBase64 } from "../utils/base64";
class TrieTree {
    root;
    constructor() {
        this.root = new Node();
    }
    get(path) {
        // const paths = this.validate(path);
        // paths.shift();
        const paths = path.split("/");
        const node = this.root;
        const params = {};
        return {
            routeParams: params,
            node: this.dig(node, paths, params),
        };
    }
    insert(path, value) {
        // const paths = this.validate(path);
        // // remove the first empty string
        // paths.shift();
        const paths = path.split("/");
        let node = this.root;
        let index = 0;
        while (index < paths.length) {
            const children = node.getChildren();
            const currentPath = paths[index];
            let target = children.find((e) => e.getPath() === currentPath);
            if (!target) {
                target = new Node(currentPath);
                children.push(target);
            }
            node = target;
            ++index;
        }
        // insert handler to node
        node.insertChild(value);
    }
    dig(node, paths, params) {
        if (paths.length === 0) {
            return node;
        }
        const target = node
            .getChildren()
            .filter((e) => e.getPath() === paths[0] || e.getPath().includes(":"));
        if (target.length === 0) {
            return null;
        }
        let next = null;
        target.forEach((e) => {
            if (e.getPath().startsWith(":")) {
                const routeParams = e.getPath().replace(":", "");
                params[routeParams] = paths[0];
            }
            paths.shift();
            next = this.dig(e, paths, params);
            if (next) {
                return next;
            }
        });
        return next;
    }
}
exports.TrieTree = TrieTree;
// node of trie tree
class Node {
    path;
    handlers = [];
    children = [];
    constructor(path) {
        this.path = path;
    }
    insertChild(handler) {
        this.handlers.push(handler);
    }
    getChildren() {
        return this.children;
    }
    getHandlers() {
        return this.handlers;
    }
    getPath() {
        return this.path;
    }
}
