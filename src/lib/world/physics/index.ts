import * as thr from 'three';
import { Cube, CubeTypes, PhysicCube } from './cube';

export class ChunkLocation extends thr.Vector2 {}

export class Chunk {
  static readonly WIDTH = 16;
  static readonly HEIGHT = 256;
  static readonly DEPTH = 16;

  private _location: ChunkLocation;
  private _cubes: PhysicCube[];

  constructor(x: number, y: number) {
    this._cubes = new Array(Chunk.WIDTH * Chunk.DEPTH * Chunk.HEIGHT);

    this._location = new ChunkLocation(x, y);
  }

  get location() {
    return this._location;
  }

  set(x: number, y: number, z: number, value: PhysicCube) {
    this._cubes[Chunk.parseIndex(x, y, z)] = value;
  }

  get(x: number, y: number, z: number): PhysicCube | undefined {
    return this._cubes[Chunk.parseIndex(x, y, z)];
  }

  at(index: number) {
    return this._cubes[index];
  }

  static parseIndex(x: number, y: number, z: number) {
    return (
      (x % this.WIDTH ) +
      (y % this.HEIGHT) * this.WIDTH +
      (z % this.DEPTH ) * this.WIDTH * this.HEIGHT
    ); 
  }

  static Vector2ToChunkLocation(x: number, y: number) {
    return new ChunkLocation(
      Math.floor(x / this.WIDTH),
      Math.floor(y / this.DEPTH)
    );
  }
}

export class PhysicSpace {
  private _chunks: Chunk[];
  private _entities: any[];
  
  constructor() {
    this._chunks = [];

    this._entities = [];
  }

  get chunks() {
    return this._chunks;
  }

  update() {
    
  }

  createChunk(x: number, y: number) {
    const chunk = new Chunk(x, y);

    this._chunks.push(chunk);

    return chunk;
  }

  getChunkByLocation(searchLocation: ChunkLocation) {
    for (const chunk of this._chunks) {
      const equals = chunk.location.x === searchLocation.x && chunk.location.y === searchLocation.y;
      
      if (equals)
        return chunk;
    }
  }

  getChunkByVector3(position: thr.Vector3) {
    const searchLocation = Chunk.Vector2ToChunkLocation(position.x, position.z);

    this.getChunkByLocation(searchLocation);
  }

  placeInChunk(cube: PhysicCube, force: boolean = false) {
    const { x, y, z } = cube.position;

    const chunkLocation = Chunk.Vector2ToChunkLocation(x, z);

    let chunk = this.getChunkByLocation(chunkLocation);

    if (!chunk)
      chunk = this.createChunk(chunkLocation.x, chunkLocation.y)

    if (force || chunk.get(x, y, z))
      chunk.set(x, y, z, cube);
  }

  createCube(position: thr.Vector3, texture: thr.Texture) {
    const cube = new Cube(texture);
    
    const { x, y, z } = position;
    
    cube.position.set(x, y, z);

    this.placeInChunk(cube);

    return cube;
  }

  removeCube() {
    
  }
}