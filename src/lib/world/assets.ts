import * as thr from 'three';

export interface TextureMap {
  [k: string]: thr.Texture | undefined;
}

export interface LoadTexturesParam {
  name: string;
  url: string;
}

export interface LoadAssetsParams {
  texture: LoadTexturesParam[];
}

export namespace Enums {
  export enum AssetsLoadedState {
    NOT_LOADED,
    ERROR_ON_LOAD,
    LOADED_SOME_ASSETS,
    LOADED_ALL_ASSETS
  }
}

export class WorldAssets {
  private _loadedTextures: TextureMap;
  private _loadState: Enums.AssetsLoadedState;
  private _textureLoader: thr.TextureLoader;

  constructor() {
    this._loadedTextures = {};
    this._loadState = Enums.AssetsLoadedState.NOT_LOADED;

    this._textureLoader = new thr.TextureLoader();
  }

  get loadState() {
    return this._loadState;
  }

  async load(params: LoadAssetsParams) {
    const texturesPromise = this.loadTextures(...(params.texture ?? []));

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
    
      this.setTexture(name, texture);

      return true;
    } catch (e) {
      console.warn(`Cant load texture named ${name} with url ${url} because exeption: ${e}`);

      return false;
    }
  }

  setTexture(name: string, texture: thr.Texture) {
    this._loadedTextures[name] = texture;
  }

  getTexture(name: string) {
    const texture = this._loadedTextures[name];

    if (!texture) throw new Error('Texture not found!');

    return texture;
  }

  removeTexture(name: string) {
    return delete this._loadedTextures[name];
  }
}