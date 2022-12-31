import { WorldScene } from "./scene";
import * as thr from 'three';
import { EventEmitter } from "events";
import { PhysicCube, Cube, CubeTypes } from "./cube";
import { WorldAssets, LoadTexturesParam } from "./assets";

export class World extends EventEmitter {
  static readonly defaultTextures: LoadTexturesParam[] = [
    {
      name: 'dirt',
      url: './textures/Dirt.png',
    }
  ];

  private _scene: WorldScene;
  private _assets: WorldAssets;
  private _blocks: PhysicCube[];
  private _entities: any[];
  private _running: boolean;
  private _tickRate: number;
  private _tickCount: number;

  constructor() {
    super();

    this._assets = new WorldAssets();

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

  loadWorld() {
    
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
    setTimeout(() => {
      if(this._running) this.simulate();
    }, 1000 / this._tickRate);

    this.emit('tick', this._tickCount);

    this._tickCount++;
  }

  get scene() {
    return this._scene;
  }

  get assets() {
    return this._assets;
  }

  createCube<K extends keyof CubeTypes>(type: K): CubeTypes[K] {
    if (type === 'dirt')
      return new Cube(this._assets.textures.get('dirt'));

    throw new Error('This type dont exists!');
  }
}