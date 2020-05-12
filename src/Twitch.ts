import Modpack from './Modpack';
import * as fs from 'fs';
import * as http from 'http';

class Twitch extends Modpack{
readonly manifest : JSON;

  constructor(file: string, type: string, author: string, version: string, manifest: JSON) {
      super(file, type, author, version);
      this.manifest = manifest;
  }

  /**
   * Downloads all mods in manifest.json and saves it in a mods folder
   * 
   * @param path Location to save mods folder to
   */
  download(path: string){
    
  }

  /**
   * Creates a MutliMC compatible instance
   * 
   * Download mods using the download() interface and copies the overrides folder 
   * 
   * @param path Location to save MultiMC instance to
   */
  createMultiMC(path: string){

  }
}

export default Twitch;