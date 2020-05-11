// Modpack.ts
/**
 * Contains class object Modpack
 * @packageDocumentation
 */
import * as AdmZip from 'adm-zip';
import * as path from 'path';

/**
 * Contains information about a modpack given the file
 */
class Modpack {
    /** File path to modpack file (can be relative or absolute)*/
    readonly file: string;
    /** String generated describing the best guess type of the file */
    private _type: string;
    /** JSON object file for twitch pack */
    readonly manifest: JSON;


    get type(): string {
      return this._type;
    }
  
    set type(type: string) {
      this._type = type;
    }


    /**
    * @param file  Contains the path to the modpack file.
    */
    constructor(file: string) {
      this.file = file;
      this.type = this.determineType();
      this.manifest = null;
    }
    /**
     * Atempts to guess the type of modpack.
     * 
     * @returns string 'twitch', 'multimc' or null
     */
    public determineType = () : string => {
      let modpackPath : string = this.file ;
      let pathExtention = path.extname(modpackPath);
      if(pathExtention == ".zip"){
        var zip = new AdmZip(modpackPath);
        var zipEntries = zip.getEntries();

        // Behavior is undefined if there is elements of both types of modpacks. 
        for(let i = 0; i < zipEntries.length; i++){
          if (zipEntries[i].entryName == "manifest.json") {
            return "twitch";
          } else if(zipEntries[i].entryName == "instance.cfg"){
            return "multimc"
          }
        }
        return null;
      }
    }
  }

  export default Modpack