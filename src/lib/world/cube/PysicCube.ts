import * as thr from 'three';

export abstract class PhysicCube extends thr.Mesh<thr.BoxGeometry, thr.MeshPhysicalMaterial> {
  readonly cubeType: string;

  constructor(texture: thr.Texture) {
    const geometry = new thr.BoxGeometry(1, 1, 1);
    const material = new thr.MeshPhysicalMaterial({color: 0xffffff, map: texture});

    super(geometry, material);

    this.cubeType = 'undefined';
  }
}