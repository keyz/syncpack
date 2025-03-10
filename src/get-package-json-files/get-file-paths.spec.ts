import { Effect, pipe } from 'effect';
import { expect, it } from 'vitest';
import type { TestScenario } from '../../test/lib/create-scenario';
import { createScenario } from '../../test/lib/create-scenario';
import { CWD } from '../constants';
import { getFilePaths, NoSourcesFoundError } from './get-file-paths';

function runScenario(getScenario: () => TestScenario) {
  const scenario = getScenario();
  return Effect.runSync(
    pipe(
      getFilePaths(scenario.io, {
        cli: scenario.cli,
        rcFile: scenario.filesByName['.syncpackrc'] || {},
      }),
      Effect.merge,
    ),
  );
}

it('returns error when patterns match no files', () => {
  expect(
    runScenario(
      createScenario({
        '.syncpackrc': {
          source: ['matches-nothing/**'],
        },
      }),
    ),
  ).toEqual(
    new NoSourcesFoundError({
      CWD,
      patterns: ['matches-nothing/**/package.json'],
    }),
  );
});

it('returns strings when patterns return files', () => {
  expect(
    runScenario(
      createScenario(
        {
          'packages/bar/package.json': {
            name: 'bar',
          },
        },
        {
          source: ['packages/**'],
        },
      ),
    ),
  ).toEqual([expect.stringContaining('/packages/bar/package.json')]);
});

it('adds root package.json when using yarn workspaces', () => {
  expect(
    runScenario(
      createScenario({
        'package.json': {
          name: 'foo',
          workspaces: ['apps/**'],
        },
        'apps/bar/package.json': {
          name: 'bar',
        },
      }),
    ),
  ).toEqual([expect.stringContaining('/package.json'), expect.stringContaining('/apps/bar/package.json')]);
});

it('adds root package.json when using lerna', () => {
  expect(
    runScenario(
      createScenario({
        'package.json': {
          name: 'foo',
        },
        'lerna.json': {
          packages: ['apps/**'],
        },
        'apps/bar/package.json': {
          name: 'bar',
        },
      }),
    ),
  ).toEqual([expect.stringContaining('/package.json'), expect.stringContaining('/apps/bar/package.json')]);
});

it('adds root package.json when using pnpm workspaces', () => {
  expect(
    runScenario(
      createScenario({
        'package.json': {
          name: 'foo',
        },
        'pnpm-workspace.yaml': {
          packages: ['apps/**'],
        },
        'apps/bar/package.json': {
          name: 'bar',
        },
      }),
    ),
  ).toEqual([expect.stringContaining('/package.json'), expect.stringContaining('/apps/bar/package.json')]);
});
