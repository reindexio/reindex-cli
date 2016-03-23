import chalk from 'chalk';

import { getNetrc } from './netrc';

export default function getCredentials(params) {
  let url;
  let token;

  if (params.url) {
    url = params.url[0];
  } else if (process.env.REINDEX_URL) {
    url = process.env.REINDEX_URL;
  }

  if (params.token) {
    token = params.token[0];
  } else if (process.env.REINDEX_TOKEN) {
    token = process.env.REINDEX_TOKEN;
  }

  if (!(url && token)) {
    const userNetrc = getNetrc();
    const reindexNetrc = userNetrc['accounts.reindex.io'];
    if (reindexNetrc) {
      url = url || reindexNetrc.login;
      token = token || reindexNetrc.password;
    }
  }

  if (!url) {
    console.error(chalk.red(
      `Reindex URL is missing. Please use "reindex login" or ` +
      `specify it (https://YOURAPP.myreindex.com) with ` +
      `either -u (--url) flag or REINDEX_URL enviroment variable.`
    ));
  }

  if (!token) {
    console.error(chalk.red(
      `Reindex Token is missing. Please use "reindex login" or `
      `specify it with either -t (--token) flag or ` +
      `REINDEX_TOKEN enviroment variable.`
    ));
  }

  return {
    url,
    token,
  };
}
