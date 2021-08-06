import path from 'path';
import bodyParser from 'body-parser';
import fs from 'fs-extra';
import type * as http from 'http';
import type { Application, Request, RequestHandler, Response } from 'express';
import type { Query, RouteParameters } from 'express-serve-static-core';
import errorhandler from 'errorhandler';

export interface MiddlewareOptions {
  name: string;
  root?: string;
  url?: string;
  reportDir?: string;
}

export interface SetupMiddlewareOptions extends MiddlewareOptions {
  buildHandlers?(
    options: MiddlewareOptions
  ): Array<
    RequestHandler<
      RouteParameters<string>,
      any,
      any,
      Query,
      Record<string, any>
    >
  >;
}

interface EmberCliAddon {
  project: { root: string };
}

/**
 * Sets up the middleware hooks that are required by the ember-cli addon. The return value of this function should
 * be merged into the object returned from an ember app or addon's index.js file.
 *
 * @example
 *
 * 'use strict';
 *
 * const { setupMiddlewareHooks } = require('ember-setup-middleware-reporter');
 *
 * module.exports = {
 *   name: require('./package').name,
 *
 *   ...setupMiddlewareHooks({
 *      name: 'deprecations',
 *      reportDir: 'deprecation-reports'
 *   }),
 * };
 *
 * @param options - An options object that contains necessary information for the middleware to run.
 * @returns An object containing a serverMiddleware and testemMiddleware functions that setup the middleware.
 */
export function setupMiddlewareHooks(
  options: SetupMiddlewareOptions
): Record<string, any> {
  return {
    serverMiddleware(
      this: EmberCliAddon,
      startOptions: { app: Application; server: http.Server }
    ) {
      setupMiddleware(startOptions.app, {
        root: this.project.root,
        ...options,
      });
    },

    testemMiddleware(this: EmberCliAddon, app: Application) {
      setupMiddleware(app, {
        root: this.project.root,
        ...options,
      });
    },
  };
}

/**
 * A utility function that sets up posting to a specific middleware endpoint for the ember-cli addon.
 *
 * @param app - The express application.
 * @param options - An options object that contains necessary information for the middleware to run.
 */
export function setupMiddleware(
  app: Application,
  options: SetupMiddlewareOptions
): void {
  const buildHandlers = options.buildHandlers ?? buildDefaultHandlers;

  app.post(buildUrlFromOptions(options), ...buildHandlers(app, options));
}

/**
 * Builds an array of default handlers that can be leveraged out of the box by the ember-cli addon.
 * The default handlers include one that writes the response to a file.
 *
 * @param app - The express application.
 * @param options - An options object that contains necessary information for the middleware to run.
 * @returns An array of default handlers.
 */
export function buildDefaultHandlers(
  app: Application,
  options: MiddlewareOptions
): Array<
  RequestHandler<RouteParameters<string>, any, any, Query, Record<string, any>>
> {
  app.use(errorhandler());

  return [
    bodyParser.json({ limit: '50mb' }),
    (req: Request, res: Response) => {
      const outputDir = buildReportDirFromOptions(options);
      const REPORT_TIMESTAMP = new Date().toISOString();
      const outputPath = path.resolve(
        path.join(outputDir, `${REPORT_TIMESTAMP}.json`)
      );

      fs.ensureDirSync(outputDir);
      fs.writeJsonSync(outputPath, req.body);

      res.send({
        outputPath,
      });
    },
  ];
}

/**
 * Builds the root directory for the middleware report.
 *
 * @param options - An options object that contains necessary information for the middleware to run.
 * @returns A string containing the root directory for the middleware report.
 */
export function buildRootFromOptions(options: MiddlewareOptions): string {
  return options.root ?? process.cwd();
}

/**
 * Builds the URL for the middleware report.
 *
 * @param options - An options object that contains necessary information for the middleware to run.
 * @returns A string containing the url for the middleware report.
 */
export function buildUrlFromOptions(options: MiddlewareOptions): string {
  return options.url ?? `/${options.name}`;
}

/**
 * Builds the report directory for the middleware report.
 *
 * @param options - An options object that contains necessary information for the middleware to run.
 * @returns A string containing the report directory for the middleware report.
 */
export function buildReportDirFromOptions(options: MiddlewareOptions): string {
  return (
    options.reportDir ?? path.join(buildRootFromOptions(options), options.name)
  );
}
