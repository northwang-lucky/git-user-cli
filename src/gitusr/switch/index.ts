import * as fs from 'fs-extra';
import * as path from 'path';
import * as inquirer from 'inquirer';
import { SubCommand } from '../../types';
import {
  defineQuestions,
  fillSpace2Len,
  getLongestLen,
  getUserList,
  printErr,
  printSuccessUserInfo,
  setUser,
} from '../../utils';
import { Switch } from './types';

const $switch: SubCommand = {
  install: program => {
    program
      .command('switch')
      .description('Switch user in a git repo or globally')
      .option('-g, --global', 'Switch global user')
      .option('-n, --name [name]', 'Switch user by its name (lowest priority)')
      .option('-e, --email [email]', 'Switch user by its email (medium priority)')
      .option('-i, --index [index]', 'Specifies the target user.name to switch (highest priority)')
      .action(async ({ global, name, email, index }: Switch.Options) => {
        const workPath = process.cwd();
        const isGitRepo = fs.existsSync(path.resolve(workPath, './.git'));

        // Check whether it located at a git repo or with --global
        if (!isGitRepo && !global) {
          printErr('The current directory is not a git repository!');
          return;
        }

        // eslint-disable-next-line prefer-const
        let [err, userList] = getUserList();
        if (err) {
          printErr(err);
          return;
        }

        // Check length of userList which comes from user-list.json
        if (userList.length === 0) {
          printErr('No saved users. Do you forget to run "gitusr init"?');
          return;
        }

        const target = await (async function () {
          // If an option, one of --name, --email or --index, is not undefined, use it to switch
          if (index) {
            return userList[+index];
          }
          if (email) {
            return userList.find(u => u.email === email);
          }
          if (name) {
            return userList.find(u => u.name === name);
          }

          const longestLen = getLongestLen(userList, u => u.name);
          const questions = defineQuestions<Switch.Questions, Switch.Answers>({
            userIndex: {
              type: 'list',
              message: 'Please select a user:',
              choices: userList
                // Format user.name to same length
                .map(u => {
                  u.name = fillSpace2Len(u.name, longestLen);
                  return u;
                })
                .map((u, idx) => ({
                  name: `Name: ${u.name} | Email: ${u.email}`,
                  value: idx,
                })),
            },
          });

          // Select a user and apply changes
          const answers = await inquirer.prompt(questions);
          return userList[answers.userIndex];
        })();

        if (!target) {
          printErr('User not found!');
          return;
        }

        err = setUser('name', target.name, global);
        if (err) {
          printErr(err);
          return;
        }

        err = setUser('email', target.email, global);
        if (err) {
          printErr(err);
          return;
        }

        printSuccessUserInfo(target);
      });
  },
};

export default $switch;
