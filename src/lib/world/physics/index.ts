import * as thr from 'three';
import { Cube, CubeTypes, PhysicCube } from './cube';

export class Chunk {
  static readonly WIDTH = 16;
  static readonly HEIGHT = 256;
  static readonly DEPTH = 16;

  private _position: [number, number, number];
  private _cubes: PhysicCube[];

  constructor(x: number, y: number, z: number) {
    this._cubes = new Array(Chunk.WIDTH * Chunk.DEPTH * Chunk.HEIGHT);

    this._position = [x, y, z];
  }

  get position() {
    return this._position;
  }

  set(x: number, y: number, z: number, value: PhysicCube) {
    this._cubes[Chunk.parseIndex(x, y, z)] = value;
  }

  get(x: number, y: number, z: number): PhysicCube | undefined {
    return this._cubes[Chunk.parseIndex(x, y, z)];
  }

  static parseIndex(x: number, y: number, z: number) {
    return x + y * this.WIDTH + z * this.WIDTH * this.HEIGHT; 
  }
}

export class PhysicSpace {
  private _cubes: PhysicCube[];
  private _chunks: Chunk[];
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

  createCube(position: thr.Vector3, texture: thr.Texture) {
    const cube = new Cube(texture);

    this._cubes.push(cube);

    return cube;
  }
}