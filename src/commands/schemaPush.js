import fs from 'fs';

import chalk from 'chalk';

const MIGRATE_QUERY = `
  mutation migration($input: ReindexMigrationInput!) {
    migrate(input: $input) {
      isExecuted,
      commands {
        commandType,
        description,
        isDestructive
      }
    }
  }
`;

async function pushSchema(reindex, passedTarget, { dryRun, force }) {
  let target = passedTarget;
  if (!target) {
    target = './ReindexSchema.json';
  }

  try {
    process.stdout.write(`Reading schema from ${target}...\n`);
    const schema = JSON.parse(fs.readFileSync(target));
    process.stdout.write(`Requesting migration from API...\n`);
    const response = await reindex.query(MIGRATE_QUERY, {
      input: {
        dryRun,
        force,
        types: schema,
      },
    });
    const result = await response.json();
    if (result.errors) {
      process.stderr.write(chalk.yellow('\nValidation errors:\n\n'));
      let errors = result.errors;
      if (errors.length === 1) {
        errors = errors[0].message.split('\n');
      } else {
        errors = errors.map((error) => error.message);
      }
      for (const error of errors) {
        process.stderr.write(error + '\n');
      }
      process.stderr.write(chalk.red(
        '\nValidation Error: No migration performed!\n'
      ));
    } else {
      const isExecuted = result.data.migrate.isExecuted;
      const commands = result.data.migrate.commands;
      if (commands.length === 0) {
        process.stderr.write(chalk.yellow('\nNothing to migrate!\n'));
      } else {
        process.stdout.write('\nMigrations:\n\n');
        for (const command of commands) {
          let color;
          let operation;
          if (command.isDestructive) {
            color = chalk.red;
            if (isExecuted) {
              operation = chalk.red('[DONE]\t');
            } else {
              operation = chalk.red('[SKIP]\t');
            }
          } else if (!isExecuted) {
            color = chalk.cyan;
            operation = chalk.cyan('[SKIP]\t');
          } else {
            color = chalk.green;
            operation = chalk.green('[DONE]\t');
          }
          process.stdout.write(operation);
          process.stdout.write(color(command.description) + '\n');
        }
        if (dryRun) {
          process.stderr.write(chalk.yellow(
            '\nDry-run: No migration performed!\n'
          ));
        } else if (!isExecuted) {
          process.stderr.write(chalk.yellow(
            '\nDestructive operations required: No migration performed!\n'
          ));
          process.stderr.write(chalk.yellow(
            'Use --force to force perform destructive operations\n'
          ));
        } else {
          process.stdout.write(chalk.green(
            `\nSuccessfully migrated!\n`
          ));
        }
      }
    }
  } catch (e) {
    throw e;
  }
}

export default function schemaPush(reindex, args) {
  return pushSchema(reindex, args._[1], {
    dryRun: args['dry-run'],
    force: args.force,
  });
}
