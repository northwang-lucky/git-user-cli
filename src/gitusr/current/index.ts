import { SubCommand } from '../../types';
import { getUser, hasInitialized, isGitRepo, printErr, printUserInfo } from '../../utils';
import { Current } from './types';

const $current: SubCommand = {
  install: program => {
    program
      .command('current')
      .alias('ct')
      .description('show current repo/global user')
      .option('-g, --global', 'switch global user')
      .action(({ global }: Current.Options) => {
        // Check length of userList which comes from user-list.json
        if (!hasInitialized()) {
          return;
        }

        // Check whether it located at a git repo or with --global
        if (!isGitRepo() && !global) {
          printErr('The current directory is not a git repository!');
          return;
        }

        const target = getUser({ global });
        if (!target) {
          printErr('Get user information failed!');
          return;
        }

        printUserInfo(target, { global });
      });
  },
};

export default $current;
