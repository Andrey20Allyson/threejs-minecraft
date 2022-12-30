"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = void 0;
class EventEmitter {
    _listeners;
    _maxListeners;
    constructor() {
        this._listeners = {};
        this._maxListeners = 10;
    }
    addListener(eventName, listener) {
        return this.on(eventName, listener);
    }
    once(eventName, listener) {
        const section = this._listeners[eventName] ?? [];
        section.push({
            callback: listener,
            once: true
        });
        if (this._listeners[eventName] === undefined)
            this._listeners[eventName] = section;
        return this;
    }
    removeListener(eventName, listener) {
        const section = this._listeners[eventName];
        if (!section)
            return this;
        for (let i = 0; i < listener.length; i++) {
            if (section[i].callback !== listener)
                continue;
            section.splice(i, 1);
            if (!section.length)
                delete this._listeners[eventName];
            break;
        }
        return this;
    }
    off(eventName, listener) {
        return this.removeListener(eventName, listener);
    }
    removeAllListeners(event) {
        if (event) {
            delete this._listeners[event];
        }
        else {
            this._listeners = {};
        }
        return this;
    }
    setMaxListeners(n) {
        this._maxListeners = n;
        return this;
    }
    getMaxListeners() {
        return this._maxListeners;
    }
    listeners(eventName) {
        const section = this._listeners[eventName];
        if (!section)
            return [];
        const listeners = [];
        for (const registry of section)
            listeners.push(registry.callback);
        return listeners;
    }
    rawListeners(eventName) {
        const section = this._listeners[eventName];
        if (!section)
            return [];
        const listeners = [];
        for (const registry of section) {
            if (registry.once) {
                listeners.push((...args) => {
                    registry.callback(...args);
                    this.removeListener(eventName, registry.callback);
                });
            }
            else {
                listeners.push(registry.callback);
            }
        }
        return listeners;
    }
    listenerCount(eventName) {
        return (this._listeners[eventName] ?? []).length;
    }
    prependListener(eventName, listener) {
        const section = this._listeners[eventName] ?? [];
        section.unshift({
            callback: listener,
            once: false
        });
        if (this._listeners[eventName] === undefined)
            this._listeners[eventName] = section;
        return this;
    }
    prependOnceListener(eventName, listener) {
        const section = this._listeners[eventName] ?? [];
        section.unshift({
            callback: listener,
            once: true
        });
        if (this._listeners[eventName] === undefined)
            this._listeners[eventName] = section;
        return this;
    }
    eventNames() {
        const names = [];
        for (const name in this._listeners)
            names.push(name);
        return names;
    }
    on(eventName, listener) {
        const section = this._listeners[eventName] ?? [];
        section.push({
            callback: listener,
            once: false
        });
        if (this._listeners[eventName] === undefined)
            this._listeners[eventName] = section;
        return this;
    }
    emit(eventName, ...args) {
        const section = this._listeners[eventName];
        const newSection = [];
        if (!section)
            return false;
        for (const registry of section) {
            registry.callback(...args);
            if (!registry.once)
                newSection.push(registry);
        }
        this._listeners[eventName] = newSection;
        return true;
    }
}
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=events.js.map