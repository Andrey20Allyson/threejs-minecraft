"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thr = require("three");
const sceneCreator_1 = require("./sceneCreator");
const userInputs_1 = require("./userInputs");
const scene = sceneCreator_1.PersonalizedScene.createScene();
const camera = scene.camera;
const mouse = new userInputs_1.MouseListener(document.body);
const keyboard = new userInputs_1.KeyboardListener(document.body);
mouse.on('move', (ev, moveX, moveY) => {
    if (!mouse.clicking)
        return;
    const worldDirection = camera.getWorldDirection(camera.position.clone());
    camera.rotateOnWorldAxis(new thr.Vector3(0, 1, 0), moveX * -.01);
    if ((worldDirection.y < .9 || moveY > 0) && (worldDirection.y > -.9 || moveY < 0))
        camera.rotateX(moveY * -.01);
});
const cube = scene.createTexturedCube('./Saul.png');
const handlers = {
    'p'() {
        if (scene.paused) {
            scene.start();
        }
        else {
            scene.pause();
        }
    }
};
keyboard.on('keydown', (ev) => {
    const handler = handlers[ev.key];
    if (handler)
        handler();
});
scene.on('frame', (time) => {
    const { w, a, s, d } = keyboard.keysNumber;
    cube.rotateX(.01);
    cube.rotateY(.01);
    const direction = new thr.Vector3((d - a) * .1, 0, (s - w) * .1);
    direction.applyEuler(camera.rotation);
    camera.position.add(direction);
});
scene.start();
//# sourceMappingURL=index.js.map