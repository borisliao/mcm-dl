import { determineType } from '../src/main';
import { expect } from 'chai';

describe('determineType()', function() {
  it('should determine the right modpack type from zip', function() {
    let pack = determineType("tests/sample.zip");
    expect(pack).equal("twitch");
  }); 
});