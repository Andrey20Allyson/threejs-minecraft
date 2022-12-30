"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouseListener = exports.KeyboardListener = void 0;
const events_1 = require("./events");
class KeyboardListener extends events_1.EventEmitter {
    _pressedKeys = {};
    _numberGetter;
    _booleanGetter;
    constructor(elementToListen) {
        super();
        this._numberGetter = new Proxy({}, {
            get: (t, p) => this._pressedKeys[p] ? 1 : 0,
            has: () => true,
            set: () => false,
        });
        this._booleanGetter = new Proxy({}, {
            get: (t, p) => this._pressedKeys[p] ?? false,
            has: () => true,
            set: () => false,
        });
        elementToListen.addEventListener('keydown', this.keyDownListener.bind(this));
        elementToListen.addEventListener('keyup', this.keyUpListener.bind(this));
    }
    on(eventName, listener) {
        return super.on(eventName, listener);
    }
    emit(eventName, ...args) {
        return super.emit(eventName, ...args);
    }
    get keysNumber() {
        return this._numberGetter;
    }
    get keysBoolean() {
        return this._booleanGetter;
    }
    isPressed(key) {
        return this._pressedKeys[key] ?? false;
    }
    keyDownListener(event) {
        this._pressedKeys[event.key] = true;
        this.emit('keydown', event);
    }
    keyUpListener(event) {
        this._pressedKeys[event.key] = false;
        this.emit('keyup', event);
    }
}
exports.KeyboardListener = KeyboardListener;
class MouseListener extends events_1.EventEmitter {
    _clicking;
    _pos;
    constructor(elementToListen) {
        super();
        this._pos = [0, 0];
        this._clicking = false;
        elementToListen.addEventListener('mousedown', this.mouseDownListener.bind(this));
        elementToListen.addEventListener('mouseup', this.mouseUpListener.bind(this));
        elementToListen.addEventListener('mousemove', (this.mouseMoveListener.bind(this)));
    }
    on(eventName, listener) {
        return super.on(eventName, listener);
    }
    emit(eventName, ...args) {
        return super.emit(eventName, ...args);
    }
    get clicking() {
        return this._clicking;
    }
    get pos() {
        return [...this._pos];
    }
    get x() {
        return this._pos[0];
    }
    get y() {
        return this._pos[1];
    }
    mouseMoveListener(event) {
        let [xDif, yDif] = this._pos;
        const { offsetX, offsetY } = event;
        xDif = offsetX - xDif;
        yDif = offsetY - yDif;
        this._pos = [offsetX, offsetY];
        this.emit('move', event, xDif, yDif);
    }
    mouseDownListener(event) {
        this._clicking = true;
        this.emit('down', event);
    }
    mouseUpListener(event) {
        this._clicking = false;
        this.emit('up', event);
    }
}
exports.MouseListener = MouseListener;
//# sourceMappingURL=userInputs.js.map