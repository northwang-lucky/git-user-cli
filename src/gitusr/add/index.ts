import * as inquirer from 'inquirer';
import { SubCommand } from '../../types';
import { defineQuestions, getUserList, printErr, setUserList } from '../../utils';
import { Add } from './types';

const $add: SubCommand = {
  install: program => {
    program
      .command('add')
      .description('Add and save a user')
      .action(async () => {
        const [err, userList] = getUserList();
        if (err) {
          printErr(err);
          return;
        }

        if (userList.length === 0) {
          printErr('No saved users. Do you forget to run "gitusr init"?');
          return;
        }

        const questions = defineQuestions<Add.Questions, Add.Answers>({
          userName: {
            type: 'input',
            message: 'Please enter the user.name:',
          },
          userEmail: {
            type: 'input',
            message: 'Please enter the user.email:',
          },
        });

        const { userName, userEmail } = await inquirer.prompt(questions);

        const user = userList.find(u => u.name === userName || u.email === userEmail);
        if (user) {
          printErr('User is exist!');
          return;
        }

        userList.push({ name: userName, email: userEmail });
        setUserList(userList);
        console.log('Success!');
      });
  },
};

export default $add;