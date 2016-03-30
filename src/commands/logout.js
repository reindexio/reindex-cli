import { getNetrc, saveNetrc } from '../netrc';

export default async function logout() {
  const userNetrc = getNetrc();
  if (userNetrc['accounts.reindex.io']) {
    delete userNetrc['accounts.reindex.io'];
    saveNetrc(userNetrc);
    console.log('You are now logged-out.');
  } else {
    console.log('You are not logged-in.');
  }
}
