"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_NAMESPACE = 'Server';
var info = function (message, namespace) {
    if (typeof message === 'string') {
        console.log("[" + getDate() + "] [" + (namespace || DEFAULT_NAMESPACE) + "] [INFO] " + message);
    }
    else {
        console.log("[" + getDate() + "] [" + (namespace || DEFAULT_NAMESPACE) + "] [INFO]", message);
    }
};
var warn = function (message, namespace) {
    if (typeof message === 'string') {
        console.log("[" + getDate() + "] [" + (namespace || DEFAULT_NAMESPACE) + "] [WARN] " + message);
    }
    else {
        console.log("[" + getDate() + "] [" + (namespace || DEFAULT_NAMESPACE) + "] [WARN]", message);
    }
};
var error = function (message, namespace) {
    if (typeof message === 'string') {
        console.log("[" + getDate() + "] [" + (namespace || DEFAULT_NAMESPACE) + "] [ERROR] " + message);
    }
    else {
        console.log("[" + getDate() + "] [" + (namespace || DEFAULT_NAMESPACE) + "] [ERROR]", message);
    }
};
var getDate = function () {
    return new Date().toISOString();
};
exports.default = { info: info, warn: warn, error: error };
