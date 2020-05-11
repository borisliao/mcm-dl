import Modpack from '../src/Modpack'
import { expect } from 'chai';

describe('Modpack', function() {
    it('should determine the right modpack type from zip', function() {
      let pack = new Modpack("tests/sample.zip");
      expect(pack.type).equal("twitch");
    }); 
  });