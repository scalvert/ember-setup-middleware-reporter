/* eslint-disable unicorn/prefer-node-protocol */
import * as http from 'http';
import tmp from 'tmp';
import express from 'express';
import fetch from 'node-fetch';
import { setupMiddleware } from './index';
import fs from 'fs-extra';

function createTmpDir() {
  return tmp.dirSync({ unsafeCleanup: true }).name;
}

describe('setupMiddleware', () => {
  let tmpDir: any;
  let app: express.Application;
  let server: http.Server;

  beforeEach(() => {
    tmpDir = createTmpDir();
    app = express();

    setupMiddleware(app, { root: tmpDir, name: 'foo' });

    server = app.listen(3000);
  });

  afterEach(function () {
    server.close();
  });

  it('can write a report to default location', async () => {
    const data = [{ foo: 'bar' }];

    const json = await fetch('http://localhost:3000/foo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());

    expect(fs.readJSONSync(json.outputPath)).toStrictEqual(data);
  });
});
