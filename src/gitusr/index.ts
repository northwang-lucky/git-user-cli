#!/usr/bin/env node
import { program } from 'commander';
import { getPackageJson, printErr } from '../utils';
import $add from './add';
import $current from './current';
import $init from './init';
import $list from './list';
import $switch from './switch';

const packageJson = getPackageJson();
if (!packageJson) {
  printErr("Parse package.json failed! It's not a validated json.");
  process.exit();
}

const { description, version } = packageJson;
program.name('gitusr').description(description).version(version);
$add.install(program);
$current.install(program);
$init.install(program);
$list.install(program);
$switch.install(program);

program.parse();
