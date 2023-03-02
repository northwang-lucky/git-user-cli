#!/usr/bin/env node
import * as inquirer from 'inquirer';
import * as sh from 'shelljs';
import { defineQuestions, getPackageJson, printErr } from '../utils';
import { GitClone } from './types';

const packageJson = getPackageJson();
if (!packageJson) {
  printErr("Parse package.json failed! It's not a validated json.");
  process.exit();
}

(async function main() {
  let result = sh.exec('gitusr ls');
  if (result.code !== 0) {
    printErr(result.stderr);
    return;
  }

  const questions = defineQuestions<GitClone.Questions, GitClone.Answers>({
    userIndex: {
      type: 'input',
      message: 'Please select a user and enter its index:',
      validate: (input: string) => /^[0-9]+$/.test(input),
    },
  });

  const { userIndex } = await inquirer.prompt(questions);

  const args = process.argv;
  result = sh.exec(`git clone ${args.slice(2).join(' ')}`);
  if (result.code !== 0) {
    printErr(result.stderr);
    return;
  }

  // Extract repo name
  const repoName = args.reduce((rst, arg) => {
    const reg = /\/([^/]+)\.git$/;
    const matcher = arg.match(reg);
    return matcher ? matcher[1] : rst;
  }, '');

  result = sh.exec(`cd ./${repoName} && gitusr use -i ${userIndex}`, { silent: true });
  if (result.code !== 0) {
    printErr(result.stderr);
  }

  console.log(`Success!\nRun \`cd ${repoName}\` and \`gitusr ct\` to check current user!`);
})();
