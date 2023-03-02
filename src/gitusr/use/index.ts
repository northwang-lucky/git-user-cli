import * as inquirer from 'inquirer';
import { SubCommand } from '../../types';
import {
  defineQuestions,
  fillSpace2Len,
  getLongestLen,
  getUserList,
  hasInitialized,
  isGitRepo,
  printErr,
  printUserInfo,
  setUser,
} from '../../utils';
import { Use } from './types';

const $use: SubCommand = {
  install: program => {
    program
      .command('use')
      .description('switch user in a git repo or globally')
      .option('-g, --global', 'switch global user')
      .option('-n, --name [name]', 'switch user by its name (lowest priority)')
      .option('-e, --email [email]', 'switch user by its email (medium priority)')
      .option('-i, --index [index]', 'specifies the target user.name to switch (highest priority)')
      .action(async ({ global, name, email, index }: Use.Options) => {
        // Check whether it located at a git repo or with --global
        if (!isGitRepo() && !global) {
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
        if (!hasInitialized(userList)) {
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
          const questions = defineQuestions<Use.Questions, Use.Answers>({
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

        err = setUser('name', target.name, { global });
        if (err) {
          printErr(err);
          return;
        }

        err = setUser('email', target.email, { global });
        if (err) {
          printErr(err);
          return;
        }

        printUserInfo(target, { global, showSuccess: true });
      });
  },
};

export default $use;