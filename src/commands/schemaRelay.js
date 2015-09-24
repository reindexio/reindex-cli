import fs from 'fs';

import chalk from 'chalk';

import { introspectionQuery } from 'graphql/utilities';

async function fetchRelaySchema(reindex, target) {
  if (!target) {
    throw new Error(chalk.red('Please specify file to save schema to.'));
  }
  process.stdout.write(`Fetching Relay schema from ${reindex._url}...\n`);
  const response = await reindex.query(introspectionQuery);
  const result = await response.json();
  if (response.status < 200 || response.status >= 300) {
    throw new Error(
      `Fetching the schema from '${reindex._url}' failed. ${result.error || ''}`
    );
  }
  const jsonResult = JSON.stringify(result, null, 2);
  process.stdout.write(`Writing to ${target}...\n`);
  fs.writeFileSync(target, jsonResult);
  process.stdout.write('Done!\n');
}

export default function schemaRelay(reindex, args) {
  return fetchRelaySchema(reindex, args._[1]);
}
