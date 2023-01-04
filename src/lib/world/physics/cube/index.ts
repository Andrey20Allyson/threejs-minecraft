import * as thr from 'three';

export interface CubeTypes {
  'dirt': Cube;
}

export enum CubeFaces {
  RIGHT = 0,
  LEFT = 1,
  TOP = 2,
  BOTTON = 3,
  FRONT = 4,
  BACK = 5
}

export abstract class PhysicCube extends thr.Mesh<thr.BoxGeometry, thr.MeshPhysicalMaterial[]> {
  static readonly NUMBER_OF_FACES = 6;
  readonly cubeType: string;

  constructor(texture: thr.Texture) {
    super(PhysicCube.createGeometry(), PhysicCube.createSimpleFaces(texture));

    if (!this.haveCubeFaces())
      throw new Error('Dont have all cube faces!');

    this.cubeType = 'undefined';
  }

  haveCubeFaces() {
    return this.material.length === PhysicCube.NUMBER_OF_FACES;
  }

  static createGeometry() {
    return new thr.BoxGeometry(1, 1, 1);
  }

  static createSimpleFaces(texture: thr.Texture) {
    const faces = []; 

    for (let i = 0; i < this.NUMBER_OF_FACES; i++)
      faces.push(new thr.MeshPhysicalMaterial({color: 0xffffff, map: texture}));

    return faces;
  }

  getFace(face: CubeFaces) {
    return this.material[face];
  }
}

export class Cube extends PhysicCube {
  
}