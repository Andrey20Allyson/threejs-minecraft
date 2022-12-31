import { WorldScene } from "./scene";
import * as thr from 'three';
import { EventEmitter } from "events";
import { PhysicCube } from "./cube/PysicCube";
import { Cube } from './cube/Cube';

export class World extends EventEmitter {
  private _scene: WorldScene;
  private _blocks: PhysicCube[];
  private _entities: any[];
  private _running: boolean;
  private _tickRate: number;
  private _tickCount: number;

  constructor() {
    super();

    this._blocks = [];
    this._entities = [];

    this._running = false;
    this._tickRate = 20;
    this._tickCount = 0;

    this._scene = WorldScene.createScene();
  }

  on(eventName: 'tick', listener: (count: number) => void): this;
  on(eventName: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(eventName, listener);
  }

  emit(eventName: 'tick', count: number): boolean;
  emit(eventName: string | symbol, ...args: any[]): boolean {
    return super.emit(eventName, ...args);
  }

  start() {
    this._running = true;

    this._scene.start();

    setTimeout(() => this.simulate());
  }

  pause() {
    this._running = false;

    this._scene.pause();
  }

  simulate() {
    if(this._running)
      setTimeout(() => this.simulate(), 1000 / this._tickRate);

    this.emit('tick', this._tickCount);

    this._tickCount++;
  }

  get scene() {
    return this._scene;
  }

  createCube(type: string) {
    
  }
}