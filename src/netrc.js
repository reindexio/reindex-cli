import fs from 'fs';
import os from 'os';
import path from 'path';
import netrc from 'netrc';

export function getNetrc() {
  try {
    return netrc(getFile());
  } catch (e) {
    return {};
  }
}

export function saveNetrc(obj) {
  fs.writeFileSync(getFile(), netrc.format(obj) + os.EOL);
}

function getFile() {
  const home = process.env[
    (/^win/.test(process.platform)) ? 'USERPROFILE' : 'HOME'
  ];
  return path.join(home, '.netrc');
}
