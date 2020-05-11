import Modpack from './Modpack';

class Twitch extends Modpack{
readonly manifest : JSON;

  constructor(file: string, type: string, author: string, version: string, manifest) {
      super(file, type, author, version);
      this.manifest = require(manifest);
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