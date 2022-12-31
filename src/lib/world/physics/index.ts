import * as thr from 'three';
import { Cube, CubeTypes, PhysicCube } from './cube';

export class Chunk {
  
}

export class PhysicSpace {
  private _cubes: PhysicCube[];
  private _chunks: PhysicCube[][];
  private _entities: any[];
  
  constructor() {
    this._cubes = [];

    this._chunks = [];

    this._entities = [];
  }

  get chunks() {
    return this._chunks;
  }

  get cubes() {
    return this._cubes;
  }

  update() {
    
  }

  createCube(texture: thr.Texture) {
    const cube = new Cube(texture);

    this._cubes.push(cube);

    return cube;
  }
}