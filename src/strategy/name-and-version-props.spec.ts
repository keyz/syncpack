import { Effect } from 'effect';
import { describe, expect, it } from 'vitest';
import type { TestScenario } from '../../test/lib/create-scenario';
import { createScenario } from '../../test/lib/create-scenario';
import { NameAndVersionPropsStrategy } from './name-and-version-props';

function getRootPackage(filesByName: TestScenario['filesByName']) {
  return createScenario(filesByName)().getRootPackage();
}

it('gets and sets a name and version from 2 seperate locations', () => {
  const file = getRootPackage({
    'package.json': {
      name: 'foo',
      version: '1.2.3',
    },
  });
  const strategy = new NameAndVersionPropsStrategy('local', 'version', 'name');
  const initial = [['foo', '1.2.3']];
  const updated = [['foo', '2.0.0']];
  expect(Effect.runSyncExit(strategy.read(file))).toEqual(Effect.succeed(initial));
  expect(Effect.runSyncExit(strategy.write(file, ['foo', '2.0.0']))).toEqual(Effect.succeed(file));
  expect(Effect.runSyncExit(strategy.read(file))).toEqual(Effect.succeed(updated));
});

it('gets and sets a name and version from 2 seperate nested locations', () => {
  const strategy = new NameAndVersionPropsStrategy('custom', 'deeper.versionNumber', 'sibling.id');
  const file = getRootPackage({
    'package.json': {
      name: 'foo',
      sibling: {
        id: 'some-name',
      },
      deeper: {
        versionNumber: '1.2.3',
      },
    },
  });
  const initial = [['some-name', '1.2.3']];
  const updated = [['some-name', '2.0.0']];
  expect(Effect.runSyncExit(strategy.read(file))).toEqual(Effect.succeed(initial));
  expect(Effect.runSyncExit(strategy.write(file, ['some-name', '2.0.0']))).toEqual(Effect.succeed(file));
  expect(Effect.runSyncExit(strategy.read(file))).toEqual(Effect.succeed(updated));
});

describe('when name is "local" used internally for local packages', () => {
  it('returns empty array when namePath is not found', () => {
    const strategy = new NameAndVersionPropsStrategy('local', 'version', 'never.gonna');
    const file = getRootPackage({
      'package.json': {
        version: '0.0.0',
      },
    });
    expect(Effect.runSyncExit(strategy.read(file))).toEqual(Effect.succeed([]));
  });

  it('returns an entry marked as missing when version (path) is not found', () => {
    const strategy = new NameAndVersionPropsStrategy('local', 'never.gonna', 'name');
    const file = getRootPackage({
      'package.json': {
        name: 'foo',
        version: '0.0.0',
      },
    });
    expect(Effect.runSyncExit(strategy.read(file))).toEqual(Effect.succeed([['foo', 'PACKAGE_JSON_HAS_NO_VERSION']]));
  });
});

describe('when name is not "local"', () => {
  it('returns empty array when namePath is not found', () => {
    const strategy = new NameAndVersionPropsStrategy('someName', 'version', 'never.gonna');
    const file = getRootPackage({
      'package.json': {
        version: '0.0.0',
      },
    });
    expect(Effect.runSyncExit(strategy.read(file))).toEqual(Effect.succeed([]));
  });

  it('returns empty array when version (path) is not found', () => {
    const strategy = new NameAndVersionPropsStrategy('someName', 'never.gonna', 'name');
    const file = getRootPackage({
      'package.json': {
        name: 'foo',
        version: '0.0.0',
      },
    });
    expect(Effect.runSyncExit(strategy.read(file))).toEqual(Effect.succeed([]));
  });
});
