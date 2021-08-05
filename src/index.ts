import path from 'path';
import bodyParser from 'body-parser';
import fs from 'fs-extra';
import type * as http from 'http';
import type {
  Application,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import type { Query, RouteParameters } from 'express-serve-static-core';

export interface MiddlewareUtilsOptions {
  name: string;
  root?: string;
  url?: string;
  reportDir?: string;
}

export interface SetupMiddlewareUtilsOptions extends MiddlewareUtilsOptions {
  buildHandlers?(
    options: MiddlewareUtilsOptions
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

export function setupMiddlewareHooks(options: SetupMiddlewareUtilsOptions) {
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

export function setupMiddleware(
  app: Application,
  options: SetupMiddlewareUtilsOptions
) {
  const buildHandlers = options.buildHandlers ?? buildDefaultHandlers;

  app.post(buildUrlFromOptions(options), ...buildHandlers(options));
}

export function buildDefaultHandlers(options: MiddlewareUtilsOptions) {
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
    logMiddlewareError,
  ];
}

export function buildRootFromOptions(options: MiddlewareUtilsOptions) {
  return options.root ?? process.cwd();
}

export function buildUrlFromOptions(options: MiddlewareUtilsOptions) {
  return options.url ?? `/${options.name}`;
}

export function buildReportDirFromOptions(options: MiddlewareUtilsOptions) {
  return (
    options.reportDir ?? path.join(buildRootFromOptions(options), options.name)
  );
}

export function logMiddlewareError(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);
  next(err);
}
