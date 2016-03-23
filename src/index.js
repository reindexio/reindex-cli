import fs from 'fs';

import { mapValues } from 'lodash';
import parseArgs from 'minimist';
import chalk from 'chalk';

import Reindex from 'reindex-js';

import getCredentials from './getCredentials';

import login from './commands/login';
import logout from './commands/logout';
import schemaRelay from './commands/schemaRelay';
import schemaFetch from './commands/schemaFetch';
import schemaPush from './commands/schemaPush';
import graphiqlLink from './commands/graphiqlLink';

const COMMANDS = {
  'login': {
    command: login,
    needsAPI: false,
    description: 'login into Reindex',
  },
  'logout': {
    command: logout,
    needsAPI: false,
    description: 'logout from Reindex',
  },
  'schema-relay': {
    command: schemaRelay,
    needsAPI: true,
    description: 'get Relay schema definition from Reindex',
  },
  'schema-fetch': {
    command: schemaFetch,
    needsAPI: true,
    description: 'get Reindex schema from the API',
  },
  'schema-push': {
    command: schemaPush,
    needsAPI: true,
    description: 'push new schema to Reindex',
  },
  'graphiql': {
    command: graphiqlLink,
    needsAPI: true,
    description: 'open Reindex GraphiQL browser console for your app',
  },
  'help': {
    command: printCommands,
    description: 'print Reindex commands and options',
  },
};

const PARAMETERS = {
  'url': {
    alias: ['u', 'url'],
    description: 'Reindex API URL (https://YOURAPP.myreindex.com)',
  },
  'token': {
    alias: ['t', 'token'],
    description: 'Reindex API authentication token',
  },
};

export default async function cli(args) {
  const params = parseArgs(args, {
    alias: mapValues(PARAMETERS, (param) => param.alias),
  });
  const commandName = params._[0];
  if (COMMANDS[commandName]) {
    const command = COMMANDS[commandName];

    const reindex = new Reindex();
    if (command.needsAPI) {
      const { url, token } = getCredentials(params);
      if (!(url && token)) {
        return;
      }
      reindex._url = url;
      reindex.setToken(token);
    }

    await command.command(reindex, params);
  } else if (commandName) {
    process.stdout.write(chalk.red(
      `'${commandName}' is not a Reindex command. See 'reindex help'. \n`
    ));
  } else {
    printCommands();
  }
}

function printCommands() {
  process.stdout.write(fs.readFileSync(__dirname + '/logo.txt'));
  process.stdout.write('\n');
  process.stdout.write('Usage: reindex <command> [options]\n');
  const commandNames = Object.keys(COMMANDS).sort();
  process.stdout.write('\nCommands:\n');
  for (const name of commandNames) {
    process.stdout.write(`\t${name}\t${COMMANDS[name].description}\n`);
  }
  const paramNames = Object.keys(PARAMETERS).sort();
  process.stdout.write('\nOptions:\n');
  for (const param of paramNames) {
    const paramOptions = PARAMETERS[param];
    const label = paramOptions.alias.map((alias) => {
      if (alias.length === 1) {
        return `-${alias}`;
      } else {
        return `--${alias}`;
      }
    }).join(', ');
    process.stdout.write(`\t${label}\t${paramOptions.description}\n`);
  }
  process.stdout.write('\n');
}
