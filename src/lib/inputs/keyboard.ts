import { EventEmitter } from 'events';

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


