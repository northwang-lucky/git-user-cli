import { SubCommand } from '../../types';
import { fillSpace2Len, getLongestLen, getUserList, hasInitialized, printErr } from '../../utils';

const $list: SubCommand = {
  install: program => {
    program
      .command('list')
      .alias('ls')
      .description('show all saved users')
      .action(() => {
        const [err, userList] = getUserList();
        if (err) {
          printErr(err);
          return;
        }

        // Check length of userList which comes from user-list.json
        if (!hasInitialized(userList)) {
          return;
        }

        const longestLen = getLongestLen(userList, u => u.name);
        const output = userList
          .map((u, i) => {
            const lastIndex = userList.length - 1;
            const index = fillSpace2Len(`${i}:`, `${lastIndex}:`.length);
            const name = fillSpace2Len(u.name, longestLen);
            return `${index} Name: ${name} | Email: ${u.email}`;
          })
          .join('\n');
        console.log(output);
      });
  },
};

export default $list;
