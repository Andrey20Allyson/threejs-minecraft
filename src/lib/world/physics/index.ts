import * as thr from 'three';
import { Cube, CubeTypes, PhysicCube } from './cube';
import { Chunk, ChunkLocation } from './chunk';
import { EventEmitter } from 'events';

export class PhysicSpace extends EventEmitter {
  private _chunks: Chunk[];
  private _entities: any[];
  
  constructor() {
    super();
    this._chunks = [];

    this._entities = [];
  }

  get chunks() {
    return this._chunks;
  }

  on(eventName: 'added', listener: (cube: PhysicCube) => void): this;
  on(eventName: 'removed', listener: (cube: PhysicCube) => void): this;
  on(eventName: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(eventName, listener);
  }
  
  emit(eventName: 'added', cube: PhysicCube): boolean;
  emit(eventName: 'removed', cube: PhysicCube): boolean;
  emit(eventName: string | symbol, ...args: any[]): boolean {
    return super.emit(eventName, ...args);
  }

  update() {
    
  }

  createChunk(x: number, y: number) {
    const chunk = new Chunk(x, y);

    this._chunks.push(chunk);

    return chunk;
  }
  
  createChunkByLocation(localtion: ChunkLocation) {
    const { x, y } = localtion;
    return this.createChunk(x, y);
  }

  getChunkByLocation(searchLocation: ChunkLocation) {
    for (const chunk of this._chunks) {
      const equals = chunk.location.x === searchLocation.x && chunk.location.y === searchLocation.y;
      
      if (equals)
        return chunk;
    }
  }

  getChunkByVector3(position: thr.Vector3) {
    const searchLocation = ChunkLocation.fromVector3(position);

    return this.getChunkByLocation(searchLocation);
  }

  placeInChunk(cube: PhysicCube, force: boolean = false) {
    const chunkLocation = ChunkLocation.fromVector3(cube.position);

    let chunk = this.getChunkByLocation(chunkLocation);

    if (!chunk)
      chunk = this.createChunkByLocation(chunkLocation);

    const oldCube = chunk.getByVector3(cube.position)

    if (force || !oldCube) {
      chunk.addCube(cube);

      this.emit('added', cube);
    }

    if (force && oldCube)
      this.emit('removed', oldCube);
  }

  addCube(cube: PhysicCube, position?: thr.Vector3) {
    if (position) {
      const { x, y, z } = position;
      cube.position.set(x, y, z);
    }

    this.placeInChunk(cube);

    return cube;
  }

  getCube(position: thr.Vector3) {
    const chunk = this.getChunkByVector3(position);

    if (!chunk) return;

    return chunk.getByVector3(position);
  }

  moveCube(oldPosition: thr.Vector3, newPosition: thr.Vector3): boolean {
    const oldChunk = this.getChunkByVector3(oldPosition);
    const newChunk = this.getChunkByVector3(newPosition);

    if (!oldChunk || !newChunk) return false;

    const cube = oldChunk.removeByVector3(oldPosition);

    if (!cube) return false;

    newChunk.setByVector3(newPosition, cube);

    return true;
  }

  createCube(position: thr.Vector3, texture: thr.Texture) {
    return this.addCube(new Cube(texture), position);
  }

  removeCube(position: thr.Vector3) {
    const chunk = this.getChunkByVector3(position);

    if (!chunk) return;

    const cube = chunk.removeByVector3(position);

    if (cube)
      this.emit('removed', cube);

    return cube;
  }
}