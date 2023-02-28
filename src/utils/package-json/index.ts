import * as fs from 'fs-extra';
import * as path from 'path';

const packageJson = fs.readFileSync(path.resolve(__dirname, '../../../package.json'), {
  encoding: 'utf-8',
});

export function getPackageJson(): Record<string, any> | null {
  try {
    return JSON.parse(packageJson);
  } catch (err) {
    return null;
  }
}
