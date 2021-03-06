import Modpack from './Modpack';
import * as fs from 'fs-extra';
import * as https from 'https';
import * as Path from 'path';
import * as AdmZip from 'adm-zip';
import * as events from 'events';

const API = (projectID: string, fileID: string) => 'https://addons-ecs.forgesvc.net/api/v2/addon/'+projectID+'/file/'+fileID+'/download-url'
const getFilenameFromUrl = (url : String) => url.substring(url.lastIndexOf('/') + 1);

class Twitch extends Modpack{
  // any type unavoidable due to lack of json basic type
  //   Read: https://github.com/microsoft/TypeScript/issues/1897
  readonly manifest: any;

  constructor(file: string, type: string, author: string, version: string, manifest: any) {
      super(file, type, author, version);
      this.manifest = manifest;
  }

  /**
   * Grabs the url from the forge api
   * 
   * @param URL complete url
   * @param callback function with URL as argument
   */
  private getURL(URL: string, callback: Function) {
    https.get(URL, (res) => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];

      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      } else if (!/^text\/plain/.test(contentType)) {
        error = new Error('Invalid content-type.\n' +
                          `Expected text/plain but received ${contentType}`);
      }    

      if (error) {
        console.error(error.message);
        // Consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          callback(rawData);
        } catch (e) {
          console.error(e.message);
        }
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });
  }

  /**
   * Downloads a individual mod to a path given the url.
   * 
   * @param url Direct link to the jar file
   * @param path string location to save to
   * @param callback = callback function when finished, no inputs
   */
  private async downloadMod(url: string, path: string, callback: Function) {
    let rawData = fs.createWriteStream(path);
    https.get(url, (res) => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];

      let error;
      if (statusCode == 302) {
        https.get(res.headers.location, (res)=>{
          res.pipe(rawData);
          res.on('end', () => {
            rawData.close();
            callback();
          });
        });
      }
      else if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      }
      if (error) {
        console.error(error.message);
        // Consume response data to free up memory
        res.resume();
        return;
      }
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    }).on('finish', ()=>{
    });

  }

  /**
   * Downloads all mods in manifest.json and saves it in a mods folder
   * 
   * @param path Location to save mods folder to
   * @param progressCallback
   * @returns Promise
   */
  download(path: string, cb: Function = ()=>{}){
    const promise = new Promise((resolve, reject) => {
      let files = this.manifest.files;

      if(!files) { return resolve () } // return ends the function ( does not return a value )

      let savePath: string;
      // Assure path will contain a mods folder
      if(Path.basename(path) == "mods"){
        savePath = path;
        if (!fs.existsSync(savePath)){
          fs.mkdirSync(savePath, {recursive:true});
        }
      }else{
        savePath = Path.join(path,'mods');
        if (!fs.existsSync(savePath)){
          fs.mkdirSync(savePath, {recursive:true});
        }
      }

      let downloaded = 0;
      let total : number = files.length;

      for(let i = 0; i < files.length; i++){
        let downloadURL = API(files[i].projectID,files[i].fileID);
        this.getURL(downloadURL, (url: string) => {
          this.downloadMod(url, Path.join(savePath, getFilenameFromUrl(url)),()=>{
            downloaded++;
            cb({percent: downloaded/total, totalDownloaded: downloaded, total: total});
            if(downloaded == total){
              resolve()
            }
          });
        });
      }
    });
    
    return promise;
  }

  /**
   * Creates a MutliMC compatible instance
   * 
   * Download mods using the download() interface and copies the overrides folder 
   * 
   * @param path Location to save MultiMC instance to
   */
  async createMultiMC(path: string, progressCallback: Function = () => {}){
    let folderName = Path.join(path, this.manifest.name);
    fs.mkdirSync(folderName, {recursive:true});
    let mcFolder = Path.join(folderName, '.minecraft')
    let overrideFolder = Path.join(folderName, 'overrides')

    await this.download(mcFolder, progressCallback);
    let zip = new AdmZip(this.file);
    zip.extractAllTo(folderName, true);
    if(fs.existsSync(overrideFolder)){
      fs.copySync(overrideFolder, mcFolder);
      fs.removeSync(overrideFolder)
    }
  }
}

export default Twitch;