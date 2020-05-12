import * as AdmZip from 'adm-zip';
import * as path from 'path';
import Modpack from './Modpack';
import Twitch from './Twitch';

/**
 * Atempts to guess the type of modpack.
 * 
 * @param file path to modpack file
 * @returns `string` or `null` if error
 */
function determineType(file: string) : string {
    let pathExtention = path.extname(file);

    if(pathExtention == ".zip"){
        let zip = new AdmZip(file);
        let zipEntries = zip.getEntries();

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

/**
 * Creates a Modpack object or a object that will based on the type of file. 
 * Determines the type of file using determineType()
 * 
 * @param file path to modpack file
 * @param type format type of the file contents (eg. 'twitch')
 * @returns `Modpack` or object that extends modpack
 */
function createModpack(file: string): any{
    if(determineType(file) == 'twitch'){
        let zip = new AdmZip(file);
        let manifest = JSON.parse(zip.readAsText('manifest.json'));
        let author = manifest.author;
        let version = manifest.version;
        let x = new Twitch(file,'twitch',author,version, manifest);
        return x;
    }

}

export {determineType, createModpack};