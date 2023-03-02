import * as inquirer from 'inquirer';
import * as sh from 'shelljs';
import { fillSpace2Len, getLongestLen } from '../basic';
import { defineQuestions } from '../define-questions';
import { User } from '../user-list/types';
import { GetTargetUser, GetUserOptions, PrintUserInfoOptions, SetUserOptions } from './types';

export function getUser({ global = false }: GetUserOptions = {}): User | null {
  const user: User = {
    name: '',
    email: '',
  };

  // Get global user.name by git
  let result = sh.exec(`git config ${global ? '--global ' : ''}--get user.name`, { silent: true });
  if (result.code !== 0) {
    return null;
  }
  user.name = result.stdout.trim();

  // Get global user.email by git
  result = sh.exec(`git config ${global ? '--global ' : ''}--get user.email`, { silent: true });
  if (result.code !== 0) {
    return null;
  }
  user.email = result.stdout.trim();

  return user;
}

export function setUser(type: 'name' | 'email', value: string, { global = false }: SetUserOptions = {}): Error | null {
  const cmd = `git config ${global ? '--global ' : ''}user.${type} "${value}"`;
  const result = sh.exec(cmd);
  return result.code !== 0 ? new Error(result.stderr) : null;
}

export function printUserInfo(
  { name, email }: User,
  { global = false, showSuccess = false }: PrintUserInfoOptions = {}
): void {
  console.log(
    `${showSuccess ? 'Success!\n' : ''}Your ${
      global ? 'global' : 'repo'
    } git user is:\n\nuser.name  = ${name}\nuser.email = ${email}`
  );
}

export async function getTargetUser(
  userList: User[],
  { index, email, name }: GetTargetUser.Options
): Promise<[User | undefined, number]> {
  // If an option, one of --name, --email or --index, is not undefined, use it to switch
  if (index) {
    const idx = Number(index);
    return [userList[idx], idx];
  }
  if (email) {
    const idx = userList.findIndex(u => u.email === email);
    return [idx > 0 ? userList[idx] : undefined, idx];
  }
  if (name) {
    const idx = userList.findIndex(u => u.name === name);
    return [idx > 0 ? userList[idx] : undefined, idx];
  }

  const longestLen = getLongestLen(userList, u => u.name);
  const questions = defineQuestions<GetTargetUser.Questions, GetTargetUser.Answers>({
    userIndex: {
      type: 'list',
      message: 'Please select a user:',
      choices: userList.map((u, idx) => {
        // Format user.name to same length
        const nm = fillSpace2Len(u.name, longestLen);
        return { name: `Name: ${nm} | Email: ${u.email}`, value: idx };
      }),
    },
  });

  // Select a user and apply changes
  const answers = await inquirer.prompt(questions);
  const idx = Number(answers.userIndex);
  return [userList[idx], idx];
}
