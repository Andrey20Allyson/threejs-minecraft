import { EventEmitter } from './events';

export interface Getter<T> {
  [k: string | symbol]: T;
}

export interface IPressedKeys {
  [k: string | symbol]: boolean | undefined;
}

export class KeyboardListener extends EventEmitter {
  private _pressedKeys: IPressedKeys = {};
  private _numberGetter: Getter<number>;
  private _booleanGetter: Getter<boolean>;

  constructor(elementToListen: HTMLElement) {
    super();

    this._numberGetter = new Proxy({}, {
      get: (t, p) => this._pressedKeys[p]? 1: 0,
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

  on(eventName: 'keydown', listener: (ev: KeyboardEvent) => void): this;
  on(eventName: 'keyup', listener: (ev: KeyboardEvent) => void): this;
  on(eventName: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(eventName, listener);
  }

  emit(eventName: 'keydown', ev: KeyboardEvent): boolean;
  emit(eventName: 'keyup', ev: KeyboardEvent): boolean;
  emit(eventName: string | symbol, ...args: any[]): boolean {
    return super.emit(eventName, ...args); 
  }

  get keysNumber(): Getter<number> {
    return this._numberGetter;
  }

  get keysBoolean(): Getter<boolean> {
    return this._booleanGetter
  }

  isPressed(key: string): boolean {
    return this._pressedKeys[key] ?? false;
  }

  private keyDownListener(event: KeyboardEvent) {
    this._pressedKeys[event.key] = true;

    this.emit('keydown', event);
  }

  private keyUpListener(event: KeyboardEvent) {
    this._pressedKeys[event.key] = false;

    this.emit('keyup', event);
  }
}

export class MouseListener extends EventEmitter {
  private _clicking: boolean;
  private _pos: [number, number];

  constructor(elementToListen: HTMLElement) {
    super();

    this._pos = [0, 0];

    this._clicking = false;

    elementToListen.addEventListener('mousedown', this.mouseDownListener.bind(this));
    elementToListen.addEventListener('mouseup', this.mouseUpListener.bind(this));
    elementToListen.addEventListener('mousemove', (this.mouseMoveListener.bind(this)));
  }

  on(eventName: 'down', listener: (event: MouseEvent) => void): this;
  on(eventName: 'up', listener: (event: MouseEvent) => void): this;
  on(eventName: 'move', listener: (event: MouseEvent, moveX: number, moveY: number) => void): this;
  on(eventName: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(eventName, listener);
  }

  emit(eventName: 'down', event: MouseEvent): boolean;
  emit(eventName: 'up', event: MouseEvent): boolean;
  emit(eventName: 'move', event: MouseEvent, moveX: number, moveY: number): boolean;
  emit(eventName: string | symbol, ...args: any[]): boolean {
    return super.emit(eventName, ...args);
  }

  get clicking() {
    return this._clicking;
  }

  get pos(): [number, number] {
    return [...this._pos];
  }

  get x() {
    return this._pos[0];
  }

  get y() {
    return this._pos[1];
  }

  private mouseMoveListener(event: MouseEvent) {
    let [ xDif, yDif ] = this._pos;

    const { offsetX, offsetY } = event;

    xDif = offsetX - xDif;
    yDif = offsetY - yDif;

    this._pos = [offsetX, offsetY];

    this.emit('move', event, xDif, yDif);
  }

  private mouseDownListener(event: MouseEvent) {
    this._clicking = true;

    this.emit('down', event);
  }

  private mouseUpListener(event: MouseEvent) {
    this._clicking = false;

    this.emit('up', event);
  }
}
