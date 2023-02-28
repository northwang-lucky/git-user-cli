import * as fs from 'fs-extra';
import * as path from 'path';
import * as inquirer from 'inquirer';
import { SubCommand } from '../../types';
import { defineQuestions, getUserList, printErr, printSuccessUserInfo, setUser } from '../../utils';
import { Switch } from './types';

const $switch: SubCommand = {
  install: program => {
    program
      .command('switch')
      .description('Switch user in a git repo or globally')
      .option('-g, --global', 'Switch global user')
      .action(async (options: Switch.Options) => {
        const workPath = process.cwd();
        const isGitRepo = fs.existsSync(path.resolve(workPath, './.git'));

        // Check whether it located at a git repo or with --global
        if (!isGitRepo && !options.global) {
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

        const questions = defineQuestions<Switch.Questions, Switch.Answers>({
          userIndex: {
            type: 'list',
            message: 'Please select a user:',
            choices: userList.map((u, index) => ({
              name: `Name:  ${u.name}\n  Email: ${u.email}`,
              value: index,
            })),
          },
        });

        // Select a user and apply changes
        const answers = await inquirer.prompt(questions);
        const target = userList[answers.userIndex];
        if (!target) {
          printErr(`User not found by index: ${answers.userIndex}`);
          return;
        }

        err = setUser('name', target.name, options.global);
        if (err) {
          printErr(err);
          return;
        }

        err = setUser('email', target.email, options.global);
        if (err) {
          printErr(err);
          return;
        }

        printSuccessUserInfo(target);
      });
  },
};

export default $switch;
