import * as main from '../src/main';
import { expect } from 'chai';
import Twitch from '../src/Twitch'
import * as AdmZip from 'adm-zip';

describe('determineType()', function() {
  it('should determine type:\'twitch\' from sample.zip', function() {
    let pack = main.determineType("tests/sample.zip");
    expect(pack).equal("twitch");
  });
});

describe('createModpack()', function() {
  it('should return twitch pack from sample.zip', function() {
    let pack = main.createModpack("tests/sample.zip");
    let zip = new AdmZip(pack.file);
    let manifest = JSON.parse(zip.readAsText('manifest.json'));
    let x = new Twitch("tests/sample.zip",'twitch',"3upman","4.0.1", manifest);
    expect(pack.file).equal('tests/sample.zip');
    expect(pack.type).equal('twitch');
    expect(pack.version).equal('4.0.1');
    expect(pack.author).equal('3upman');
  });
});