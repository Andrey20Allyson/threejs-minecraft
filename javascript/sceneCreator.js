"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalizedScene = void 0;
const thr = require("three");
const events_1 = require("./events");
class PersonalizedScene extends events_1.EventEmitter {
    _scene;
    _camera;
    _renderer;
    _textureLoader;
    _paused;
    constructor() {
        super();
        this._scene = new thr.Scene();
        this._camera = new thr.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this._camera.position.z = 5;
        this._renderer = new thr.WebGLRenderer();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.shadowMap.enabled = true;
        this._textureLoader = new thr.TextureLoader();
        document.body.appendChild(this._renderer.domElement);
        this._paused = true;
    }
    on(eventName, listener) {
        return super.on(eventName, listener);
    }
    emit(eventName, ...args) {
        return super.emit(eventName, ...args);
    }
    get paused() {
        return this._paused;
    }
    pause() {
        this._paused = true;
    }
    start() {
        this._paused = false;
        requestAnimationFrame((time) => this.animate(time));
    }
    animate(time) {
        if (!this._paused)
            requestAnimationFrame((time) => this.animate(time));
        this.emit('frame', time);
        this._renderer.render(this._scene, this._camera);
    }
    createTexturedCube(textureName) {
        const geometry = new thr.BoxGeometry(1, 1, 1);
        let texture;
        try {
            texture = this._textureLoader.load(textureName);
        }
        catch (e) {
            console.log(e);
        }
        const material = new thr.MeshPhongMaterial({
            color: 0xffffff,
            map: texture
        });
        const cube = new thr.Mesh(geometry, material);
        this._scene.add(cube);
        return cube;
    }
    get camera() {
        return this._camera;
    }
    get scene() {
        return this._scene;
    }
    get renderer() {
        return this._renderer;
    }
    static createScene() {
        const PScene = new this();
        const ambientLight = new thr.AmbientLight(0x555555);
        const light = new thr.DirectionalLight();
        light.position.set(0.5, 0.5, 1);
        const grid = new thr.GridHelper();
        grid.position.y -= 1;
        PScene._scene.add(light);
        PScene._scene.add(grid);
        PScene._scene.add(ambientLight);
        return PScene;
    }
}
exports.PersonalizedScene = PersonalizedScene;
//# sourceMappingURL=sceneCreator.js.map