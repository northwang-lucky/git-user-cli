import * as fs from 'fs-extra';
import * as path from 'path';
import { printErr } from '../print-error';
import { User } from './types';

const USER_HOME = process.env.HOME || process.env.USERPROFILE;
if (!USER_HOME) {
  printErr('Cannot find the user directory!');
  process.exit();
}

const userListPath = path.resolve(USER_HOME, './.gitusr/user-list.json');

export function getUserList(): [Error | null, User[]] {
  if (!fs.existsSync(userListPath)) {
    fs.createFileSync(userListPath);
    fs.writeJsonSync(userListPath, []);
    return [null, []];
  }

  try {
    return [null, fs.readJsonSync(userListPath, { encoding: 'utf-8' })];
  } catch (err) {
    return [new Error(`Parse "${userListPath}" failed! It's not a validated json.`), []];
  }
}

export function setUserList(userList: User[]): void {
  if (!fs.existsSync(userListPath)) {
    fs.createFileSync(userListPath);
  }
  fs.writeJsonSync(userListPath, userList, { spaces: 2 });
}
