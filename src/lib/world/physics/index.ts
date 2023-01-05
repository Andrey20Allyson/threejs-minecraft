import * as thr from 'three';
import { Cube, CubeFaces as CubeFace, CubeTypes, PhysicCube } from './cube';
import { Chunk, ChunkLocation } from './chunk';
import { EventEmitter } from 'events';

export type NeighborInfo = [number, number, number, CubeFace, CubeFace] 

export class PhysicSpace extends EventEmitter {
  static readonly NEIGHBORS_POSITIONS: NeighborInfo[] = [
    [ 1, 0, 0, CubeFace.RIGHT, CubeFace.LEFT],
    [-1, 0, 0, CubeFace.LEFT, CubeFace.RIGHT],
    [ 0, 1, 0, CubeFace.TOP, CubeFace.BOTTON],
    [ 0,-1, 0, CubeFace.BOTTON, CubeFace.TOP],
    [ 0, 0, 1, CubeFace.FRONT, CubeFace.BACK],
    [ 0, 0,-1, CubeFace.BACK, CubeFace.FRONT]
  ];

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

  * neighborsOf(position: thr.Vector3): Generator<[PhysicCube, CubeFace, CubeFace]> {
    const { x, y, z } = position;

    for (const [nx, ny, nz, face, neighborFace] of PhysicSpace.NEIGHBORS_POSITIONS) {
      const chunk = this.getChunkByLocation(ChunkLocation.fromXY(x + nx, z + nz));
      if (!chunk) continue;

      const cube = chunk.get(x + nx, y + ny, z + nz);
      if (!cube) continue;

      yield [cube, face, neighborFace];
    }
  }

  hideCollidingFaces(cube: PhysicCube) {
    for (const [neighborCube, face, neighborFace] of this.neighborsOf(cube.position)) {
      cube.getFace(face).visible = false;

      neighborCube.getFace(neighborFace).visible = false;
    }
  }

  showNeighborFaces(position: thr.Vector3) {
    for (const [neighborCube, face, neighborFace] of this.neighborsOf(position))
      neighborCube.getFace(neighborFace).visible = true;
  }

  placeInChunk(cube: PhysicCube, force: boolean = false) {
    const chunkLocation = ChunkLocation.fromVector3(cube.position);

    let chunk = this.getChunkByLocation(chunkLocation);

    if (!chunk)
      chunk = this.createChunkByLocation(chunkLocation);

    const oldCube = chunk.getByVector3(cube.position);

    if (!oldCube) {
      this.hideCollidingFaces(cube);
    } else if (force) {
      this.emit('removed', oldCube);
    }

    if (force || !oldCube) {
      chunk.addCube(cube);

      this.emit('added', cube);
    }
  }

  addCube(cube: PhysicCube, position?: thr.Vector3) {
    if (position)
      cube.position.copy(position);

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