import { WoldRender } from "./render";
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

  private _render: WoldRender;
  private _assets: WorldAssets;
  private _space: PhysicSpace;
  private _running: boolean;
  private _tickRate: number;
  private _tickCount: number;

  constructor() {
    super();

    this._tickRate = World.defaultTickRate;
    this._tickCount = 0;
    this._running = false;

    this._assets = new WorldAssets();
    this._space = new PhysicSpace();
    this._render = WoldRender.createRender();

    this.space.on('added', cube => this.render.scene.add(cube));
    this.space.on('removed', cube => this.render.scene.remove(cube));
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
        const cube = this.space.createCube(new thr.Vector3(i, 0, j), texture);

        newChunk.push(cube);

        this.render.scene.add(cube);
      }
    }
  }

  start() {
    if (this._running) return;

    this._running = true;

    this._render.start();

    setTimeout(() => this.simulate());
  }

  pause() {
    this._running = false;

    this._render.pause();
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

  get render() {
    return this._render;
  }

  get space() {
    return this._space;
  }

  get assets() {
    return this._assets;
  }
}