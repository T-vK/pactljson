import { expect } from 'chai';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { rawPactlToObj } from '../index.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('rawPactlToObj', () => {
    it('should convert `pactl list` output into an object', async () => {
      const pactlRawListMockPath = new URL('pactl-raw-list-mock.txt', `file://${__dirname}/`);
      const pactlRawListMock = await readFile(pactlRawListMockPath, 'utf8');
      
      const pactlJsonListMockPath = new URL('pactl-json-list-mock.json', `file://${__dirname}/`);
      const pactlJsonListMock = JSON.parse(await readFile(pactlJsonListMockPath, 'utf8'));

      const result = rawPactlToObj(pactlRawListMock);
      
      expect(JSON.stringify(result)).to.equal(JSON.stringify(pactlJsonListMock));
    });
  });
