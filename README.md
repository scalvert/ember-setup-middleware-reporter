# ember-setup-middleware-reporter

![CI Build](https://github.com/scalvert/ember-setup-middleware-reporter/workflows/CI%20Build/badge.svg)
[![npm version](https://badge.fury.io/js/%40scalvert%2Fember-setup-middleware-reporter.svg)](https://badge.fury.io/js/%40scalvert%2Fember-setup-middleware-reporter)
[![License](https://img.shields.io/npm/l/@scalvert/ember-setup-middleware-reporter.svg)](https://github.com/@scalvert/ember-setup-middleware-reporter/blob/master/package.json)
![Dependabot](https://badgen.net/badge/icon/dependabot?icon=dependabot&label)
![Volta Managed](https://img.shields.io/static/v1?label=volta&message=managed&color=yellow&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QAeQC6AMEpK7AhAAAACXBIWXMAAAsSAAALEgHS3X78AAAAB3RJTUUH5AMGFS07qAYEaAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAFmSURBVDjLY2CgB/g/j0H5/2wGW2xyTAQ1r2DQYOBgm8nwh+EY6TYvZtD7f9rn5e81fAGka17GYPL/esObP+dyj5Cs+edqZsv/V8o//H+z7P+XHarW+NSyoAv8WsFszyKTtoVBM5Tn7/Xys+zf7v76vYrJlPEvAwPjH0YGxp//3jGl/L8LU8+IrPnPUkY3ZomoDQwOpZwMv14zMHy8yMDwh4mB4Q8jA8OTgwz/L299wMDyx4Mp9f9NDAP+bWVwY3jGsJpB3JaDQVCEgYHlLwPDfwYWRqVQJgZmHoZ/+3PPfWP+68Mb/Pw5sqUoLni9ipuRnekrAwMjA8Ofb6K8/PKBF5nU7RX+Hize8Y2DOZTP7+kXogPy1zrH+f/vT/j/Z5nUvGcr5VhJioUf88UC/59L+/97gUgDyVH4YzqXxL8dOs/+zuFLJivd/53HseLPPHZPsjT/nsHi93cqozHZue7rLDYhUvUAADjCgneouzo/AAAAAElFTkSuQmCC&link=https://volta.sh)
![TypeScript](https://badgen.net/badge/icon/typescript?icon=typescript&label)
[![Code Style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](#badge)

> Utilities to setup server middleware for Ember apps and addons.

Ember apps and addons include a mechanism to setup server middleware in order to inject additional work into the ember-cli pipeline. The process of setting up server middleware is repetitive, so this package provides a few utilities to make it easier.

## Installation

```sh
npm install @scalvert/ember-setup-middleware-reporter --save-dev
```

## Usage

This package's functions are provided in small, composable pieces. Each allow you to succesively build up a middleware pipeline.

In most cases, using the `setupMiddlewareHooks` function will be the easiest way to get started. By providing only the `name` option, this value will be used for both the `url` and `reportDir` options. This means that any output generated as the result of this middleware running will be stored in the `reportDir` directory.

```js
'use strict';

const { setupMiddlewareHooks } = require('ember-setup-middleware-reporter');

module.exports = {
  name: require('./package').name,

  ...setupMiddlewareHooks({
    name: 'deprecation-workflow',
  }),
};
```

You can additionally provide the following options:

```js
'use strict';

const { setupMiddlewareHooks } = require('ember-setup-middleware-reporter');

module.exports = {
  name: require('./package').name,

  ...setupMiddlewareHooks({
    name: 'deprecation-workflow',
    urlPath: 'deprecations',
    reportDir: 'deprecation-reports',
  }),
```

This will create a middleware that will listen for requests to the `deprecations` path. Any requests to this path will be passed through to the `deprecation-workflow` middleware. The output of this middleware will be stored in the `deprecation-reports` directory.

It's also possible to provide your own handlers to the middleware. This is useful if you want to add additional functionality not provided out-of-the-box by this package, such as posting data to an API endpoint.

```js
'use strict';

const { setupMiddlewareHooks } = require('ember-setup-middleware-reporter');

module.exports = {
  name: require('./package').name,

  ...setupMiddlewareHooks({
    name: 'deprecation-workflow',
    buildMiddleware: (app, options) => {
      // build and return an array of handlers
      return [
        async (req: Request, res: Response) => {
          await fetch('http://some-domain/some-reporting-endpoint', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
          });

          res.send({
            success: true,
          });
        },
      ]
    }
  }),
```

## API

<!--DOCS_START-->

<dl>
<dt><a href="#setupMiddlewareHooks">setupMiddlewareHooks(options)</a> ⇒</dt>
<dd><p>Sets up the middleware hooks that are required by the ember-cli addon. The return value of this function should
be merged into the object returned from an ember app or addon&#39;s index.js file.</p>
</dd>
<dt><a href="#setupMiddleware">setupMiddleware(app, options)</a> ⇒</dt>
<dd><p>A utility function that sets up posting to a specific middleware endpoint for the ember-cli addon.</p>
</dd>
<dt><a href="#buildDefaultHandlers">buildDefaultHandlers(app, options)</a> ⇒</dt>
<dd><p>Builds an array of default handlers that can be leveraged out of the box by the ember-cli addon.
The default handlers include one that writes the response to a file.</p>
</dd>
<dt><a href="#buildRootFromOptions">buildRootFromOptions(options)</a> ⇒</dt>
<dd><p>Builds the root directory for the middleware report.</p>
</dd>
<dt><a href="#buildUrlPathFromOptions">buildUrlPathFromOptions(options)</a> ⇒</dt>
<dd><p>Builds the URL for the middleware report.</p>
</dd>
<dt><a href="#buildReportDirFromOptions">buildReportDirFromOptions(options)</a> ⇒</dt>
<dd><p>Builds the report directory for the middleware report.</p>
</dd>
</dl>

<a name="setupMiddlewareHooks"></a>

## setupMiddlewareHooks(options) ⇒

Sets up the middleware hooks that are required by the ember-cli addon. The return value of this function should
be merged into the object returned from an ember app or addon's index.js file.

**Kind**: global function
**Returns**: An object containing a serverMiddleware and testemMiddleware functions that setup the middleware.

| Param                   | Description                                                                                                    |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| options                 | An options object that contains necessary information for the middleware to run.                               |
| options.name            | The name of the middleware.                                                                                    |
| [options.urlPath]       | The url that the middleware should respond to. If url is not provided, options.name will be used.              |
| [options.reportDir]     | The directory where the reports should be written to. If reportDir is not provided, options.name will be used. |
| [options.buildHandlers] | A function that takes the options object and returns an array of handlers.                                     |

**Example**

```js
'use strict';

const { setupMiddlewareHooks } = require('ember-setup-middleware-reporter');

module.exports = {
  name: require('./package').name,

  ...setupMiddlewareHooks({
    name: 'deprecations',
    reportDir: 'deprecation-reports',
  }),
};
```

<a name="setupMiddleware"></a>

## setupMiddleware(app, options) ⇒

A utility function that sets up posting to a specific middleware endpoint for the ember-cli addon.

**Kind**: global function
**Returns**: An object containing a serverMiddleware and testemMiddleware functions that setup the middleware.

| Param                   | Description                                                                                                    |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| app                     | The express application.                                                                                       |
| options                 | An options object that contains necessary information for the middleware to run.                               |
| options.name            | The name of the middleware.                                                                                    |
| [options.urlPath]       | The url that the middleware should respond to. If url is not provided, options.name will be used.              |
| [options.reportDir]     | The directory where the reports should be written to. If reportDir is not provided, options.name will be used. |
| [options.buildHandlers] | A function that takes the options object and returns an array of handlers.                                     |

<a name="buildDefaultHandlers"></a>

## buildDefaultHandlers(app, options) ⇒

Builds an array of default handlers that can be leveraged out of the box by the ember-cli addon.
The default handlers include one that writes the response to a file.

**Kind**: global function
**Returns**: An array of default handlers.

| Param               | Description                                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| app                 | The express application.                                                                                       |
| options             | An options object that contains necessary information for the middleware to run.                               |
| options.name        | The name of the middleware.                                                                                    |
| [options.urlPath]   | The url that the middleware should respond to. If url is not provided, options.name will be used.              |
| [options.reportDir] | The directory where the reports should be written to. If reportDir is not provided, options.name will be used. |

<a name="buildRootFromOptions"></a>

## buildRootFromOptions(options) ⇒

Builds the root directory for the middleware report.

**Kind**: global function
**Returns**: A string containing the root directory for the middleware report.

| Param               | Description                                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| options             | An options object that contains necessary information for the middleware to run.                               |
| options.name        | The name of the middleware.                                                                                    |
| [options.urlPath]   | The url that the middleware should respond to. If url is not provided, options.name will be used.              |
| [options.reportDir] | The directory where the reports should be written to. If reportDir is not provided, options.name will be used. |

<a name="buildUrlPathFromOptions"></a>

## buildUrlPathFromOptions(options) ⇒

Builds the URL for the middleware report.

**Kind**: global function
**Returns**: A string containing the url for the middleware report.

| Param               | Description                                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| options             | An options object that contains necessary information for the middleware to run.                               |
| options.name        | The name of the middleware.                                                                                    |
| [options.urlPath]   | The url that the middleware should respond to. If url is not provided, options.name will be used.              |
| [options.reportDir] | The directory where the reports should be written to. If reportDir is not provided, options.name will be used. |

<a name="buildReportDirFromOptions"></a>

## buildReportDirFromOptions(options) ⇒

Builds the report directory for the middleware report.

**Kind**: global function
**Returns**: A string containing the report directory for the middleware report.

| Param               | Description                                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| options             | An options object that contains necessary information for the middleware to run.                               |
| options.name        | The name of the middleware.                                                                                    |
| [options.urlPath]   | The url that the middleware should respond to. If url is not provided, options.name will be used.              |
| [options.reportDir] | The directory where the reports should be written to. If reportDir is not provided, options.name will be used. |

<!--DOCS_END-->
