import { SubCommand } from '../../types';
import { getTargetUser, getUserList, hasInitialized, isGitRepo, printErr, printUserInfo, setUser } from '../../utils';
import { Use } from './types';

const $use: SubCommand = {
  install: program => {
    program
      .command('use')
      .description('switch user in a git repo or globally')
      .option('-g, --global', 'switch global user')
      .option('-n, --name [name]', 'switch user by its name (lowest priority)')
      .option('-e, --email [email]', 'switch user by its email (medium priority)')
      .option('-i, --index [index]', 'specifies the target index (get by "gitusr list") to switch (highest priority)')
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

        const [target] = await getTargetUser(userList, { name, email, index });
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
