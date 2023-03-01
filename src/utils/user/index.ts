import * as sh from 'shelljs';
import { User } from '../user-list/types';

export function getUser(): User | null {
  const user: User = {
    name: '',
    email: '',
  };

  // Get global user.name by git
  let result = sh.exec('git config --global --get user.name', { silent: true });
  if (result.code !== 0) {
    return null;
  }
  user.name = result.stdout.trim();

  // Get global user.email by git
  result = sh.exec('git config --global --get user.email', { silent: true });
  if (result.code !== 0) {
    return null;
  }
  user.email = result.stdout.trim();

  return user;
}

export function setUser(type: 'name' | 'email', value: string, global = false): Error | null {
  const cmd = `git config ${global ? '--global ' : ''}user.${type} "${value}"`;
  const result = sh.exec(cmd);
  return result.code !== 0 ? new Error(result.stderr) : null;
}

export function printSuccessUserInfo({ name, email }: User, global = false): void {
  console.log(
    `Success!\nYour ${global ? 'global' : 'repo'} git user is:\n\nuser.name  = ${name}\nuser.email = ${email}`
  );
}
