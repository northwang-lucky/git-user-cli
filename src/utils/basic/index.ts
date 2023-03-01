import * as fs from 'fs-extra';
import * as path from 'path';
import { printErr } from '../print-error';
import { getUserList } from '../user-list';
import { User } from '../user-list/types';

export function getLongestLen<T extends { length: number }>(arr: T[]): number;
export function getLongestLen<T>(arr: T[], getTarget: (it: T) => { length: number }): number;
export function getLongestLen<T extends { length: number }>(
  arr: T[],
  getTarget?: (it: T) => { length: number }
): number {
  return arr.reduce((result, it) => {
    const target = getTarget ? getTarget(it) : it;
    if (!target.length) {
      throw new Error('target does not have a "length" property!');
    }
    return target.length > result ? target.length : result;
  }, 0);
}

export function fillSpace2Len(target: string, len: number): string {
  const space = ' '.repeat(Math.abs(len - target.length));
  return target + space;
}

export function isGitRepo(): boolean {
  const workPath = process.cwd();
  return fs.existsSync(path.resolve(workPath, './.git'));
}

export function hasInitialized(userList?: User[]): boolean {
  if (!userList) {
    const [err, _userList] = getUserList();
    if (err) {
      printErr(err);
      return false;
    }
    userList = _userList;
  }

  if (userList.length === 0) {
    printErr('No saved users. Do you forget to run "gitusr init"?');
    return false;
  }

  return true;
}
