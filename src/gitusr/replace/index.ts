import * as inquirer from 'inquirer';
import * as sh from 'shelljs';
import { SubCommand } from '../../types';
import { defineQuestions, getTargetUser, getUserList, hasInitialized, isGitRepo, loading, printErr } from '../../utils';
import { Replace } from './types';

const $replace: SubCommand = {
  install: program => {
    program
      .command('replace')
      .description('replace name and email with a new user')
      .argument('<target-email>', 'the email of the target commit to replace')
      .option('--with-name', 'git user name that used to find the new user')
      .option('--with-email', 'git user email that used to find the new user')
      .option('--with-index', 'index of user that used to find the new user')
      .action(async (targetEmail: string, { withName, withEmail, withIndex }: Replace.Options) => {
        // Check whether it located at a git repo
        if (!isGitRepo()) {
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

        const [user] = await getTargetUser(userList, {
          name: withName,
          email: withEmail,
          index: withIndex,
        });
        if (!user) {
          printErr('User not found!');
          return;
        }

        // Run replacing code
        const scripts = `
          git filter-branch --env-filter '

          OLD_EMAIL="${targetEmail}"
          CORRECT_NAME="${user.name}"
          CORRECT_EMAIL="${user.email}"

          if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
          then
              export GIT_COMMITTER_NAME="$CORRECT_NAME"
              export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
          fi
          if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
          then
              export GIT_AUTHOR_NAME="$CORRECT_NAME"
              export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
          fi
          ' --tag-name-filter cat -- --branches --tags
        `;
        loading.start('Replacing');
        let result = sh.exec(scripts, { silent: true });
        loading.stop();
        if (result.code !== 0) {
          printErr(result.stderr);
          return;
        }
        console.log('Success!');

        // Run `gitusr use` automatically?
        const questions = defineQuestions<Replace.Questions, Replace.Answers>({
          runUseCommand: {
            type: 'list',
            message: `Would you like to switch the repository git user to the user you just specified? (name: ${user.name} | email: ${user.email})`,
            choices: ['Yes', 'No'],
            default: 'Yes',
          },
        });

        const answers = await inquirer.prompt(questions);
        const { runUseCommand } = answers;

        if (runUseCommand === 'Yes') {
          result = sh.exec(`gitusr use --email ${user.email}`);
          if (result.code !== 0) {
            printErr(result.stderr);
          }
        }
      });
  },
};

export default $replace;
