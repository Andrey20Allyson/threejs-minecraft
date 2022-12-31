import { WorldScene } from "./scene";
import * as thr from 'three';
import { EventEmitter } from "events";
import { PhysicCube } from "./cube/PysicCube";

export class World extends EventEmitter {
  private _scene: WorldScene;
  private _blocks: PhysicCube[];
  private _entities: any[];

  constructor() {
    super();

    this._blocks = [];
    this._entities = [];

    this._scene = WorldScene.createScene();
  }

  get scene() {
    return this._scene;
  }

  createCube(type: string) {
    
  }
}