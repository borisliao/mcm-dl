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
      this.type = null;
      this.determineType();
      this.manifest = null;
    }
    /**
     * Atempts to guess the type of modpack and fills out the type variable
     * 
     * Currently supports: twitch
     */
    public determineType = () => {
      let modpackPath : string = this.file ;
      let type = null;
      let pathExtention = path.extname(modpackPath);
      if(pathExtention == ".zip"){
        var zip = new AdmZip(modpackPath);
        var zipEntries = zip.getEntries();
        zipEntries.forEach(function(zipEntry) {
          if (zipEntry.entryName == "manifest.json") {
            type = "twitch";
          }
        });
      }
      this.type = type;
    }
  }

  export default Modpack