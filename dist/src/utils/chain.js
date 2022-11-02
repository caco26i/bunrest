"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chain = void 0;
function Chain(req, res, middlewares) {
    this.middlewares = middlewares.map((mid) => {
        return () => {
            mid.middlewareFunc(req, res, this.next);
            return res.isReady();
        };
    });
    this.isReady = false;
    this.next = (err) => {
        if (err) {
            throw err;
        }
        if (this.isFinish()) {
            return;
        }
        const cur = this.middlewares.shift();
        this.isReady = cur();
        if (this.isReady) {
            return;
        }
    };
    this.isFinish = () => {
        return this.middlewares.length === 0;
    };
}
exports.Chain = Chain;
