"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BunResponse = void 0;
class BunResponse {
    response;
    options = {};
    status(code) {
        this.options.status = code;
        return this;
    }
    option(option) {
        this.options = Object.assign(this.options, option);
        return this;
    }
    statusText(text) {
        this.options.statusText = text;
        return this;
    }
    json(body) {
        this.response = Response.json(body, this.options);
    }
    send(body) {
        this.response = new Response(body, this.options);
    }
    // nodejs way to set headers
    setHeader(key, value) {
        if (!key || !value) {
            throw new Error('Headers key or value should not be empty');
        }
        const headers = this.options.headers;
        if (!headers) {
            this.options.headers = { keys: value };
        }
        this.options.headers[key] = value;
        return this;
    }
    // nodejs way to get headers
    getHeader() {
        return this.options.headers;
    }
    headers(header) {
        this.options.headers = header;
        return this;
    }
    getResponse() {
        return this.response;
    }
    isReady() {
        return !!this.response;
    }
}
exports.BunResponse = BunResponse;
