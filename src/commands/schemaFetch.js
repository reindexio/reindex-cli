import fs from 'fs';

import { omit } from 'lodash';
import isThere from 'is-there';
import chalk from 'chalk';

const SCHEMA_QUERY = `
  query schemaQuery {
    list {
      ofReindexType {
        nodes {
          name,
          kind,
          interfaces,
          fields {
            name,
            type,
            description,
            nonNull,
            builtin,
            deprecationReason,
            ofType,
            reverseName,
            grantPermissions {
              read,
              create,
              update,
              delete,
            },
            defaultOrdering {
              field,
              order
            }
          }
        }
      }
    }
  }
`;

async function fetchSchema(reindex, passedTarget) {
  let target = passedTarget;
  if (!target) {
    target = './ReindexSchema.json';
  }

  if (await isThere(target)) {
    throw new Error(chalk.red(`File ${target} already exists.`));
  }

  process.stdout.write(`Fetching Reindex schema from ${reindex._url}...\n`);
  const response = await reindex.query(SCHEMA_QUERY);
  const result = await response.json();
  if (result.errors) {
    process.stderr.write(JSON.stringify(result.errors, null, 2));
    process.stderr.write('\n');
  } else {
    const types = result.data.list.ofReindexType.nodes;
    const processed = types.map((type) => {
      const cleanType = omit(type, (value) => value === null);
      cleanType.fields = cleanType.fields.map(
        (field) => omit(field, (value) => value === null)
      );
      return cleanType;
    });
    process.stdout.write(`Writing to ${target}...\n`);
    fs.writeFileSync(target, JSON.stringify(processed, null, 2) + '\n');
    process.stdout.write('Done!\n');
  }
}

export default function schemaFetch(reindex, args) {
  return fetchSchema(reindex, args._[1]);
}
