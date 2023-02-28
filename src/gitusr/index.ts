#!/usr/bin/env node
import { program } from 'commander';
import { getPackageJson } from '../utils';
import $init from './init';

const { description, version } = getPackageJson();

program.name('gitusr').description(description).version(version);
$init.install(program);

program.parse();
