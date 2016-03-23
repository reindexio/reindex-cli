import { promisify } from 'bluebird';
import { prompt as promptCallback } from 'promptly';

import { getNetrc, saveNetrc } from '../netrc';

const prompt = promisify(promptCallback);

export default async function login(reindex, args) {
  let [url, token] = args._.slice(1);

  if (!url) {
    url = await prompt('Reindex URL', {
      validator: (value) => value && value.length > 0,
      retry: true,
    });
  }

  if (!token) {
    token = await prompt('Reindex Token', {
      validator: (value) => value && value.length > 0,
      retry: true,
    });
  }

  const userNetrc = getNetrc();
  userNetrc['accounts.reindex.io'] = {
    login: url,
    password: token,
  };
  saveNetrc(userNetrc);
  console.log('You are now logged-in.');
}
