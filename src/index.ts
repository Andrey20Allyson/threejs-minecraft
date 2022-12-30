import * as thr from 'three';
import { PersonalizedScene } from './sceneCreator';
import { KeyboardListener, MouseListener } from './userInputs';

const scene = PersonalizedScene.createScene();
const camera = scene.camera;

const mouse = new MouseListener( document.body );
const keyboard = new KeyboardListener( document.body );

mouse.on('move', (ev, moveX, moveY) => {
  if (!mouse.clicking) return;

  const worldDirection = camera.getWorldDirection(camera.position.clone());

  camera.rotateOnWorldAxis(new thr.Vector3(0, 1, 0), moveX * -.01);
  
  if ((worldDirection.y < .9 || moveY > 0) && (worldDirection.y > -.9 || moveY < 0))
    camera.rotateX(moveY * -.01);
});

interface IKeyboardHandlers {
  [k: string]: Function | undefined
}

const handlers: IKeyboardHandlers = {
  'p'() {
    if (scene.paused) {
      scene.start();
    } else {
      scene.pause();
    }
  }
}

keyboard.on('keydown', (ev) => {
  const handler = handlers[ev.key];

  if (handler) handler();
});

scene.on('frame', (time) => {
  const { w, a, s, d } = keyboard.keysNumber;

  const direction = new thr.Vector3(
    (d - a) * .1,
    0,
    (s - w) * .1
  );
  
  direction.applyEuler(camera.rotation);

  camera.position.add(direction);
});

scene.start();