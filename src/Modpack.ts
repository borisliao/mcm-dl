// Modpack.ts
/**
 * Contains formats that describe a modpack
 * @packageDocumentation
 */

/**
 * Contains information that all modpack format files must adhere
 */
class Modpack {
  /** File path to modpack file (can be relative or absolute)*/
  readonly file: string;
  /** String describing the type of the modpack */
  readonly type: string;
  /** Author of the modpack */
  readonly author: string;
  /** Version of the file */
  readonly version: string;

  /**
  * @param file  Contains the path to the modpack file.
  */
  constructor(file: string, type: string, author: string, version: string) {
    this.file = file;
    this.type = type;
    this.author = author;
    this.version = version;
  }
}

export default Modpack