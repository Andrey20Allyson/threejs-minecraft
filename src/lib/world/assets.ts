import * as thr from 'three';

export interface TextureMap {
  [k: string]: thr.Texture | undefined;
}

export interface LoadTexturesParam {
  name: string;
  url: string;
}

export interface LoadAssetsParams {
  textures: LoadTexturesParam[];
}

export namespace Enums {
  export enum AssetsLoadedState {
    NOT_LOADED,
    ERROR_ON_LOAD,
    LOADED_SOME_ASSETS,
    LOADED_ALL_ASSETS
  }
}

export interface Storage<T> {
  [key: string | symbol]: T | undefined;
}

export class Storer<T> {
  private _storage: Storage<T>;

  constructor() {
    this._storage = {};
  }

  get(key: string | symbol): T {
    const value = this._storage[key];

    if (!value) throw new Error('Value not found!');
  
    return value;
  }

  set(key: string | symbol, value: T) {
    this._storage[key] = value;
  }

  remove(key: string | symbol) {
    return delete this._storage[key];
  }
}

export class WorldAssets {
  private _loadState: Enums.AssetsLoadedState;
  private _textureLoader: thr.TextureLoader;
  readonly textures: Storer<thr.Texture>;

  constructor() {
    this._loadState = Enums.AssetsLoadedState.NOT_LOADED;

    this.textures = new Storer();

    this._textureLoader = new thr.TextureLoader();
  }

  get loadState() {
    return this._loadState;
  }

  async load(params: LoadAssetsParams) {
    const texturesPromise = this.loadTextures(...(params.textures ?? []));

    try {
      const results = await Promise.all([
        texturesPromise
      ]);

      let allSuccesfullLoaded = results.every(value => value);

      this._loadState = allSuccesfullLoaded?
        Enums.AssetsLoadedState.LOADED_ALL_ASSETS:
        Enums.AssetsLoadedState.LOADED_SOME_ASSETS;

      return allSuccesfullLoaded
    } catch (e) {
      console.warn(e);
      this._loadState = Enums.AssetsLoadedState.ERROR_ON_LOAD;

      return false;
    }
  }

  async loadTextures(...params: LoadTexturesParam[]) {
    const promises = [];
    
    for (const param of params)
      promises.push( this.loadTexture(param.name, param.url) );

    try {
      const results = await Promise.all(promises);

      return results.every(value => value);
    } catch (e) {
      console.warn(`Cant load textures because exeption: ${e}`);
      
      return false;
    }
  }

  async loadTexture(name: string, url: string) {
    try {
      const texture = await this._textureLoader.loadAsync(url);
      texture.magFilter = thr.NearestFilter;
      texture.minFilter = thr.LinearMipMapLinearFilter;

      this.textures.set(name, texture);

      return true;
    } catch (e) {
      console.warn(`Cant load texture named ${name} with url ${url} because exeption: ${e}`);

      return false;
    }
  }
}