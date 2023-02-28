#!/usr/bin/env node
import { program } from 'commander';
import { getPackageJson, printErr } from '../utils';
import $init from './init';
import $switch from './switch';

const packageJson = getPackageJson();
if (!packageJson) {
  printErr("Parse package.json failed! It's not a validated json.");
  process.exit();
}

const { description, version } = packageJson;
program.name('gitusr').description(description).version(version);
$init.install(program);
$switch.install(program);

program.parse();
