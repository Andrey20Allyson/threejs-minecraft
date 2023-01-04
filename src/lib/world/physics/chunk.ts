import * as thr from 'three';
import { PhysicCube } from './cube';

export class ChunkLocation extends thr.Vector2 {
  private constructor(x?: number, y?: number) {
    super(x, y);
  }

  static fromXY(x: number, y: number) {
    return new this(
      Math.floor(x / Chunk.WIDTH),
      Math.floor(y / Chunk.DEPTH)
    );
  }
  
  static fromVector2(position: thr.Vector2) {
    const { x, y } = position;

    return this.fromXY(x, y);
  }

  static fromVector3(position: thr.Vector3) {
    const { x, z } = position;

    return this.fromXY(x, z);
  }
}

export class Chunk {
  static readonly WIDTH = 16;
  static readonly HEIGHT = 256;
  static readonly DEPTH = 16;

  private _location: ChunkLocation;
  private _cubes: PhysicCube[];

  constructor(x: number, y: number) {
    this._cubes = new Array(Chunk.WIDTH * Chunk.DEPTH * Chunk.HEIGHT);

    this._location = ChunkLocation.fromXY(x, y);
  }

  get location() {
    return this._location;
  }

  set(x: number, y: number, z: number, value: PhysicCube) {
    this._cubes[Chunk.parseIndex(x, y, z)] = value;
  }

  setByVector3(position: thr.Vector3, value: PhysicCube) {
    const { x, y, z } = position;
    this.set(x, y, z, value);
  }

  addCube(cube: PhysicCube) {
    this.setByVector3(cube.position, cube);
  }

  get(x: number, y: number, z: number) {
    return this.at(Chunk.parseIndex(x, y, z));
  }

  getByVector3(postion: thr.Vector3) {
    const { x, y, z } = postion;
    return this.get(x, y, z);
  }

  at(index: number): PhysicCube | undefined {
    return this._cubes[index];
  }

  has(x: number, y: number, z: number) {
    return this.get(x, y, z)? true: false;
  }

  hasInVector3(position: thr.Vector3) {
    const { x, y, z } = position;
    return this.has(x, y, z);
  }

  remove(x: number, y: number, z: number) {
    const index = Chunk.parseIndex(x, y, z);
    const cube = this.at(index);
    
    delete this._cubes[index];

    return cube;
  }

  removeByVector3(position: thr.Vector3) {
    const { x, y, z } = position
    return this.remove(x, y, z);
  }

  static parseIndex(x: number, y: number, z: number) {
    return (
      (x % this.WIDTH ) +
      (y % this.HEIGHT) * this.WIDTH +
      (z % this.DEPTH ) * this.WIDTH * this.HEIGHT
    ); 
  }
}