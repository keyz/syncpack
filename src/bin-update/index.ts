#!/usr/bin/env node

import chalk from 'chalk';
import { program } from 'commander';
import { Effect } from 'effect';
import { io } from '../io';
import { showHelpOnError } from '../lib/show-help-on-error';
import { option } from '../option';
import { update } from './update';

program.description('  Update to the latest versions on the npm registry.');

program.on('--help', () => {
  console.log(chalk`
Examples:
  {dim # uses defaults for resolving packages}
  syncpack update
  {dim # uses packages defined by --source when provided}
  syncpack update --source {yellow "apps/*/package.json"}
  {dim # multiple globs can be provided like this}
  syncpack update --source {yellow "apps/*/package.json"} --source {yellow "core/*/package.json"}
  {dim # uses dependencies regular expression defined by --filter when provided}
  syncpack update --filter {yellow "typescript|tslint"}
  {dim # only inspect "devDependencies"}
  syncpack update --types dev
  {dim # only inspect "devDependencies" and "peerDependencies"}
  syncpack update --types dev,peer

Resolving Packages:
  1. If {yellow --source} globs are provided, use those.
  2. If using Pnpm Workspaces, read {yellow packages} from {yellow pnpm-workspace.yaml} in the root of the project.
  3. If using Yarn Workspaces, read {yellow workspaces} from {yellow package.json}.
  4. If using Lerna, read {yellow packages} from {yellow lerna.json}.
  5. Default to {yellow "package.json"} and {yellow "packages/*/package.json"}.

Reference:
  globs            {blue.underline https://github.com/isaacs/node-glob#glob-primer}
  lerna.json       {blue.underline https://github.com/lerna/lerna#lernajson}
  Yarn Workspaces  {blue.underline https://yarnpkg.com/lang/en/docs/workspaces}
  Pnpm Workspaces  {blue.underline https://pnpm.js.org/en/workspaces}
`);
});

showHelpOnError(program);

program
  .option(...option.source)
  .option(...option.filter)
  .option(...option.config)
  .option(...option.types)
  .parse(process.argv);

Effect.runPromise<never, unknown>(
  update(io, {
    configPath: program.opts().config,
    filter: program.opts().filter,
    source: program.opts().source,
    types: program.opts().types,
  }),
);
