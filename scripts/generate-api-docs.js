import path from 'path';
import fs from 'fs';
import jsdoc2md from 'jsdoc-to-markdown';

(async function () {
  debugger;
  // eslint-disable-next-line unicorn/prefer-module
  const readmeFile = path.join(__dirname, '..', 'README.md');
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
