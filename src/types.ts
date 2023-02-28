import { Command } from 'commander';

export type SubCommand = {
  install(program: Command): void;
};
