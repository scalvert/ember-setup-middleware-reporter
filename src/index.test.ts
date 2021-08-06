/* eslint-disable unicorn/prefer-node-protocol */
import * as http from 'http';
import path from 'path';
import tmp from 'tmp';
import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs-extra';
import {
  buildReportDirFromOptions,
  buildRootFromOptions,
  buildUrlPathFromOptions,
  setupMiddleware,
} from './index';

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
  });

  afterEach(function () {
    server.close();
  });

  it('can write a report using defaults', async () => {
    setupMiddleware(app, { root: tmpDir, name: 'foo' });
    server = app.listen(3000);

    const data = [{ foo: 'bar' }];

    const json = await fetch('http://localhost:3000/foo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());

    expect(json.outputPath).toMatch(/.*foo\/.*\.json$/);
    expect(fs.readJSONSync(json.outputPath)).toStrictEqual(data);
  });

  it('can write a report via custom urlPath', async () => {
    setupMiddleware(app, { root: tmpDir, name: 'foo', urlPath: '/baz' });
    server = app.listen(3000);

    const data = [{ foo: 'bar' }];

    const json = await fetch('http://localhost:3000/baz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());

    expect(json.outputPath).toMatch(/.*foo\/.*\.json$/);
    expect(fs.readJSONSync(json.outputPath)).toStrictEqual(data);
  });

  it('can write a report via custom urlPath when urlPath does not include preceeding slash', async () => {
    setupMiddleware(app, { root: tmpDir, name: 'foo', urlPath: 'baz' });
    server = app.listen(3000);

    const data = [{ foo: 'bar' }];

    const json = await fetch('http://localhost:3000/baz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());

    expect(json.outputPath).toMatch(/.*foo\/.*\.json$/);
    expect(fs.readJSONSync(json.outputPath)).toStrictEqual(data);
  });

  it('can write a report via custom reportDir', async () => {
    setupMiddleware(app, {
      root: tmpDir,
      name: 'foo',
      reportDir: 'my-reports',
    });
    server = app.listen(3000);

    const data = [{ foo: 'bar' }];

    const json = await fetch('http://localhost:3000/foo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());

    expect(json.outputPath).toMatch(/.*my-reports\/.*\.json$/);
    expect(fs.readJSONSync(json.outputPath)).toStrictEqual(data);
  });
});

describe('buildRootFromOptions', () => {
  it('can build a root path from options when root is provided', () => {
    const options = {
      name: 'foo',
    };

    const root = buildRootFromOptions(options);

    expect(root).toBe(process.cwd());
  });

  it('can build a root path from options', () => {
    const options = {
      name: 'bar',
      root: './foo',
    };

    const root = buildRootFromOptions(options);

    expect(root).toBe('./foo');
  });
});

describe('buildUrlPathFromOptions', () => {
  it('can build a url from options when no urlPath is provided', () => {
    const options = {
      name: 'foo',
    };

    const url = buildUrlPathFromOptions(options);

    expect(url).toBe('/foo');
  });

  it('can build a url from options when urlPath is provided with no preceeding slash', () => {
    const options = {
      name: 'foo',
      urlPath: 'bar',
    };

    const url = buildUrlPathFromOptions(options);

    expect(url).toBe('/bar');
  });

  it('can build a url from options when urlPath is provided', () => {
    const options = {
      name: 'foo',
      urlPath: '/bar',
    };

    const url = buildUrlPathFromOptions(options);

    expect(url).toBe('/bar');
  });
});

describe('buildReportDirFromOptions', () => {
  it('can build a reportDir from options when no reportDir is provided', () => {
    const options = {
      name: 'foo',
    };

    const reportDir = buildReportDirFromOptions(options);

    expect(reportDir).toBe(path.join(process.cwd(), 'foo'));
  });

  it('can build a reportDir from options when reportDir is provided', () => {
    const options = {
      name: 'foo',
      reportDir: 'bar',
    };

    const reportDir = buildReportDirFromOptions(options);

    expect(reportDir).toBe(path.join(process.cwd(), 'bar'));
  });

  it('can build a reportDir from options when reportDir and root are provided', () => {
    const options = {
      name: 'foo',
      reportDir: 'bar',
      root: './baz',
    };

    const reportDir = buildReportDirFromOptions(options);

    expect(reportDir).toBe(path.join('./baz', 'bar'));
  });
});
