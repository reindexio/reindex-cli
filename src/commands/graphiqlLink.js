import open from 'open';
import chalk from 'chalk';

export default function schemaRelay(reindex) {
  const url = `${reindex._url}/?token=${reindex._token}`;
  process.stdout.write(`Opening ${chalk.bold(url)}\n`);
  open(url);
}
