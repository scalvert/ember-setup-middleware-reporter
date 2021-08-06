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

<!--DOCS_START-->

## Functions

<dl>
<dt><a href="#setupMiddlewareHooks">setupMiddlewareHooks(options)</a> ⇒</dt>
<dd><p>Sets up the middleware hooks that are required by the ember-cli addon. The return value of this function should
be merged into the object returned from an ember app or addon&#39;s index.js file.</p>
</dd>
<dt><a href="#setupMiddleware">setupMiddleware(app, options)</a></dt>
<dd><p>A utility function that sets up posting to a specific middleware endpoint for the ember-cli addon.</p>
</dd>
<dt><a href="#buildDefaultHandlers">buildDefaultHandlers(app, options)</a> ⇒</dt>
<dd><p>Builds an array of default handlers that can be leveraged out of the box by the ember-cli addon.
The default handlers include one that writes the response to a file.</p>
</dd>
<dt><a href="#buildRootFromOptions">buildRootFromOptions(options)</a> ⇒</dt>
<dd><p>Builds the root directory for the middleware report.</p>
</dd>
<dt><a href="#buildUrlFromOptions">buildUrlFromOptions(options)</a> ⇒</dt>
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

| Param | Description |
| --- | --- |
| options | An options object that contains necessary information for the middleware to run. |

**Example**  
```js
'use strict';

const { setupMiddlewareHooks } = require('ember-setup-middleware-reporter');

module.exports = {
  name: require('./package').name,

  ...setupMiddlewareHooks({
     name: 'deprecations',
     reportDir: 'deprecation-reports'
  }),
};
```
<a name="setupMiddleware"></a>

## setupMiddleware(app, options)
A utility function that sets up posting to a specific middleware endpoint for the ember-cli addon.

**Kind**: global function  

| Param | Description |
| --- | --- |
| app | The express application. |
| options | An options object that contains necessary information for the middleware to run. |

<a name="buildDefaultHandlers"></a>

## buildDefaultHandlers(app, options) ⇒
Builds an array of default handlers that can be leveraged out of the box by the ember-cli addon.
The default handlers include one that writes the response to a file.

**Kind**: global function  
**Returns**: An array of default handlers.  

| Param | Description |
| --- | --- |
| app | The express application. |
| options | An options object that contains necessary information for the middleware to run. |

<a name="buildRootFromOptions"></a>

## buildRootFromOptions(options) ⇒
Builds the root directory for the middleware report.

**Kind**: global function  
**Returns**: A string containing the root directory for the middleware report.  

| Param | Description |
| --- | --- |
| options | An options object that contains necessary information for the middleware to run. |

<a name="buildUrlFromOptions"></a>

## buildUrlFromOptions(options) ⇒
Builds the URL for the middleware report.

**Kind**: global function  
**Returns**: A string containing the url for the middleware report.  

| Param | Description |
| --- | --- |
| options | An options object that contains necessary information for the middleware to run. |

<a name="buildReportDirFromOptions"></a>

## buildReportDirFromOptions(options) ⇒
Builds the report directory for the middleware report.

**Kind**: global function  
**Returns**: A string containing the report directory for the middleware report.  

| Param | Description |
| --- | --- |
| options | An options object that contains necessary information for the middleware to run. |


<!--DOCS_END-->
