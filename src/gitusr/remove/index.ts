import { SubCommand } from '../../types';
import { getTargetUser, getUserList, hasInitialized, printErr, setUserList } from '../../utils';
import { Remove } from './types';

const $remove: SubCommand = {
  install: program => {
    program
      .command('remove')
      .alias('rm')
      .description('delete a user')
      .option('-n, --name [name]', 'delete user by its name (lowest priority)')
      .option('-e, --email [email]', 'delete user by its email (medium priority)')
      .option('-i, --index [index]', 'specifies the target index (get by "gitusr list") to delete (highest priority)')
      .action(async ({ name, email, index }: Remove.Options) => {
        const [err, userList] = getUserList();
        if (err) {
          printErr(err);
          return;
        }

        // Check length of userList which comes from user-list.json
        if (!hasInitialized(userList)) {
          return;
        }

        const [target, validatedIndex] = await getTargetUser(userList, { name, email, index });
        if (!target) {
          printErr('User not found!');
          return;
        }

        userList.splice(validatedIndex, 1);
        setUserList(userList);
        console.log(`Success! User (name: ${target.name} | email: ${target.email}) has been removed!`);
      });
  },
};

export default $remove;
