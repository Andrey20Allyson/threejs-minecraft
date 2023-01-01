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
  readonly cubeType: string;

  constructor(texture: thr.Texture) {
    const geometry = new thr.BoxGeometry(1, 1, 1);
    const faces = []

    for (let i = 0; i < 6; i++) {
      faces.push( new thr.MeshPhysicalMaterial({color: 0xffffff, map: texture}) );
    }

    super(geometry, faces);

    if (this.material.length < 6)
      throw new Error('faces cant be less than 6 faces');

    this.cubeType = 'undefined';

    this.getFace(CubeFaces.LEFT);
  }

  getFace(face: CubeFaces) {
    return this.material[face];
  }
}

export class Cube extends PhysicCube {
  
}