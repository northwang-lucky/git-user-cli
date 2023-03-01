import * as inquirer from 'inquirer';
import * as sh from 'shelljs';
import { SubCommand } from '../../types';
import { defineQuestions, getUser, getUserList, printErr, printSuccessUserInfo, setUserList, User } from '../../utils';
import { Init } from './types';

const userHomePath = process.env.HOME || process.env.USERPROFILE;
if (!userHomePath) {
  printErr('Cannot find the user home directory!');
  process.exit();
}

const $init: SubCommand = {
  install: program => {
    program
      .command('init')
      .description('read the user information from the git global configuration file to initialize the CLI')
      .option('-f, --force', 'Force commands to run at any cost')
      .action(async (options: Init.Options) => {
        const globalUser: User = getUser() ?? {
          name: '',
          email: '',
        };

        const hasGlobalUser = Boolean(globalUser.name && globalUser.email);
        const [err, userList] = getUserList();
        if (err) {
          printErr(err);
          return;
        }

        const questions = defineQuestions<Init.Questions, Init.Answers>({
          overrideConfirm: {
            type: 'list',
            message:
              'It seems that you have already run "gitusr init". If continue, all saved users will be overridden, are you sure?',
            choices: ['No', 'Yes'],
            default: 'No',
            // If --force, skip!
            // If length of userList (comes from ~/.gitusr/user-list.json) greater then 0, and without --force, show!
            when: !options.force && userList.length > 0,
          },
          userName: {
            type: 'input',
            message: 'Please enter the git config --global user.name:',
            when: !hasGlobalUser,
          },
          userEmail: {
            type: 'input',
            message: 'Please enter the git config --global user.email:',
            when: !hasGlobalUser,
          },
        });

        const answers = await inquirer.prompt(questions);
        const { overrideConfirm, userName, userEmail } = answers;

        if (overrideConfirm === 'No') {
          console.log('Nothing happened.');
          return;
        }

        // If the os usr hasn't run 'git config --global user.name/email "xxx"', cli will help he todo it!
        if (!hasGlobalUser && userName && userEmail) {
          globalUser.name = userName;
          globalUser.email = userEmail;
        }

        const { name, email } = globalUser;
        let result = sh.exec(`git config --global user.name ${name}`);
        if (result.code !== 0) {
          printErr(result.stderr);
          return;
        }
        result = sh.exec(`git config --global user.email ${email}`);
        if (result.code !== 0) {
          printErr(result.stderr);
          return;
        }

        setUserList([globalUser]);
        printSuccessUserInfo(globalUser);
      });
  },
};

export default $init;
