import * as AdmZip from 'adm-zip';
import * as path from 'path';

/**
 * Atempts to guess the type of modpack.
 * 
 * @param file path to modpack file
 * @returns string of the type or null if could not determine
 */
function determineType(file: string) : string {
    let pathExtention = path.extname(file);

    if(pathExtention == ".zip"){
        var zip = new AdmZip(file);
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

export {determineType};