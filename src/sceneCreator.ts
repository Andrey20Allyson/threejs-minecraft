import * as thr from "three";
import { EventEmitter } from "./events";

export class PersonalizedScene extends EventEmitter {
  private _scene: thr.Scene;
  private _camera: thr.Camera;
  private _renderer: thr.WebGLRenderer;

  private _paused: boolean;

  constructor() {
    super();

    this._scene = new thr.Scene();
    
    this._camera = new thr.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    
    this._renderer = new thr.WebGLRenderer();
    this._renderer.setSize( window.innerWidth, window.innerHeight );
    this._renderer.shadowMap.enabled = true;

    document.body.appendChild( this._renderer.domElement );
    
    this._paused = true;
  }

  on(eventName: 'frame', listener: (time: DOMHighResTimeStamp) => void): this;
  on(eventName: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(eventName, listener);
  }

  emit(eventName: 'frame', time: DOMHighResTimeStamp): boolean;
  emit(eventName: string | symbol, ...args: any[]): boolean {
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
    requestAnimationFrame( (time) => this.animate(time) );
  }

  animate(time: DOMHighResTimeStamp) {
    if (!this._paused)
      requestAnimationFrame( (time) => this.animate(time) );

    this.emit('frame', time);
  
    this._renderer.render( this._scene, this._camera );
  }

  get camera() {
    return this._camera;
  }

  static createScene() {
    const PScene = new this();

    const geometry = new thr.BoxGeometry( 1, 1, 1 );
    const texture = new thr.TextureLoader().load('./Saul.png');
    const material = new thr.MeshPhongMaterial( { color: 0xffffff, shadowSide: thr.FrontSide, map: texture } );

    const cube = new thr.Mesh( geometry, material );

    const ambientLight = new thr.AmbientLight(0x555555);

    const light = new thr.DirectionalLight();
    light.position.set( 0.5, 0.5, 1 );

    PScene._camera.position.z = 5;

    const grid = new thr.GridHelper();
    grid.position.y -= 1;

    PScene._scene.add( cube );
    PScene._scene.add( light );
    PScene._scene.add( grid );
    PScene._scene.add( ambientLight );

    return PScene;
  }
}