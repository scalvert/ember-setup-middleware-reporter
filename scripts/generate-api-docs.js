import path from 'path';
import fs from 'fs';
import jsdoc2md from 'jsdoc-to-markdown';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

(async function () {
  debugger;
  const readmeFile = path.join(path.dirname(__filename), '..', 'README.md');
  const readmeContent = fs.readFileSync(readmeFile, 'utf8');
  const docsPlaceholder = /<!--DOCS_START-->[\S\s]*<!--DOCS_END-->/;

  let docsContent = await jsdoc2md.render({
    files: ['lib/index.js'],
  });

  fs.writeFileSync(
    readmeFile,
    readmeContent.replace(
      docsPlaceholder,
      `<!--DOCS_START-->\n\n${docsContent}\n<!--DOCS_END-->`
    )
  );
})();
