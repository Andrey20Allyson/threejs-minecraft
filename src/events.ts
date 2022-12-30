export interface listenerRegistry {
  callback: (...args: any[]) => void;
  once: boolean;
}

export interface listeners {
  [k: string | symbol]: listenerRegistry[] | undefined;
}

export class EventEmitter implements NodeJS.EventEmitter {
  private _listeners: listeners;

  private _maxListeners: number; 

  constructor() {
    this._listeners = {};
    this._maxListeners = 10;
  }

  addListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
    return this.on(eventName, listener);
  }

  once(eventName: string | symbol, listener: (...args: any[]) => void): this {
    const section = this._listeners[eventName] ?? [];

    section.push({
      callback: listener,
      once: true
    });

    if (this._listeners[eventName] === undefined)
      this._listeners[eventName] = section;

    return this;
  }

  removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
    const section = this._listeners[eventName];

    if (!section) return this;

    for (let i = 0; i < listener.length; i++) {
      if (section[i].callback !== listener) continue;

      section.splice(i, 1);

      if (!section.length)
        delete this._listeners[eventName];

      break;
    }

    return this;
  }

  off(eventName: string | symbol, listener: (...args: any[]) => void): this {
    return this.removeListener(eventName, listener);
  }

  removeAllListeners(event?: string | symbol | undefined): this {
    if (event) {
      delete this._listeners[event];
    } else {
      this._listeners = {};
    }

    return this;
  }

  setMaxListeners(n: number): this {
    this._maxListeners = n;
    return this;
  }

  getMaxListeners(): number {
    return this._maxListeners;
  }

  listeners(eventName: string | symbol): Function[] {
    const section = this._listeners[eventName];
    
    if (!section) return [];
    
    const listeners = [];
    
    for (const registry of section)
      listeners.push(registry.callback);

    return listeners;
  }

  rawListeners(eventName: string | symbol): Function[] {
    const section = this._listeners[eventName];

    if (!section) return [];

    const listeners = [];

    for (const registry of section) {
      if (registry.once) {
        listeners.push((...args: any[]) => {
          registry.callback(...args);
          this.removeListener(eventName, registry.callback);
        });
      } else {
        listeners.push(registry.callback);
      }
    }

    return listeners;
  }

  listenerCount(eventName: string | symbol): number {
    return (this._listeners[eventName] ?? []).length;
  }

  prependListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
    const section = this._listeners[eventName] ?? [];

    section.unshift({
      callback: listener,
      once: false
    });

    if (this._listeners[eventName] === undefined)
      this._listeners[eventName] = section;

    return this;
  }
  
  prependOnceListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
    const section = this._listeners[eventName] ?? [];

    section.unshift({
      callback: listener,
      once: true
    });

    if (this._listeners[eventName] === undefined)
      this._listeners[eventName] = section;

    return this;
  }

  eventNames(): (string | symbol)[] {
    const names = [];

    for (const name in this._listeners)
      names.push(name);

    return names;
  }

  on(eventName: string | symbol, listener: (...args: any[]) => void): this {
    const section = this._listeners[eventName] ?? [];

    section.push({
      callback: listener,
      once: false
    });

    if (this._listeners[eventName] === undefined)
      this._listeners[eventName] = section;

    return this;
  }

  emit(eventName: string | symbol, ...args: any[]): boolean {
    const section = this._listeners[eventName];
    const newSection = []

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