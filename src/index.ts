import { World } from './lib/world';
import { MouseListener, KeyboardListener } from './lib/inputs';
import * as thr from 'three';

async function main() {
  const world = new World();
  const mouse = new MouseListener( document.body );
  const keyboard = new KeyboardListener( document.body );

  const camera = world.render.camera;
  const CAMERA_MOVEMENT_SPEED = 0.05;
  const CAMERA_ROTATE_SPEED = 0.01;

  const success = await world.assets.load({
    textures: World.defaultTextures
  });

  mouse.on('move', (ev, mx, my) => {
    if (!mouse.clicking) return;

    camera.rotateX(my * -CAMERA_ROTATE_SPEED);
    camera.rotateOnWorldAxis(new thr.Vector3(0, 1, 0), mx * -CAMERA_ROTATE_SPEED);
  });

  keyboard.on('keyup', (ev) => {
    if (ev.key !== 'p') return;
    if (world.running) {
      world.pause();
    } else {
      world.start();
    };
  });

  world.on('tick', count => {
    const { w, a, s, d } = keyboard.keysNumber;

    const direction = new thr.Vector3(
      (d - a) * CAMERA_MOVEMENT_SPEED,
      0,
      (s - w) * CAMERA_MOVEMENT_SPEED
    );

    direction.applyEuler(camera.rotation);
    
    camera.position.add(direction);
  });

  world.generate();
  
  world.start();
}

main();