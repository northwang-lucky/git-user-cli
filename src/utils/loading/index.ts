import { dots } from 'cli-spinners';
import ora from 'ora';

const spinner = ora({ ...dots });

export const loading = {
  start: (title: string) => spinner.start(title),
  stop: () => spinner.stop(),
};
