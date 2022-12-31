import { WorldScene } from "./scene";
import * as thr from 'three';
import { EventEmitter } from "events";
import { PhysicCube, CubeTypes, CubeFaces } from "./physics/cube";
import { WorldAssets, LoadTexturesParam } from "./assets";
import { PhysicSpace } from "./physics";

export class World extends EventEmitter {
  static readonly defaultTickRate: number = 40; 
  static readonly defaultTextures: LoadTexturesParam[] = [
    {
      name: 'dirt',
      url: './textures/Dirt.png',
    }
  ];

  private _scene: WorldScene;
  private _assets: WorldAssets;
  private _space: PhysicSpace;
  private _running: boolean;
  private _tickRate: number;
  private _tickCount: number;

  constructor() {
    super();

    this._assets = new WorldAssets();
    this._space = new PhysicSpace();

    this._tickRate = World.defaultTickRate;
    this._tickCount = 0;
    this._running = false;

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

  generate() {
    const newChunk = [];

    const texture = this._assets.textures.get('dirt');

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const cube = this.space.createCube(texture);
        
        cube.position.set(i, 0, j);

        newChunk.push(cube);

        this.scene.scene.add(cube);
      }
    }
    
    this._space.chunks.push(newChunk);
  }

  start() {
    if (this._running) return;

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

  get running() {
    return this._running;
  }

  get scene() {
    return this._scene;
  }

  get space() {
    return this._space;
  }

  get assets() {
    return this._assets;
  }
}