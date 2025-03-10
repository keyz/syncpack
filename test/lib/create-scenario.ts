import { Effect } from 'effect';
import type * as fs from 'fs';
import * as globby from 'globby';
import { createFsFromVolume, Volume } from 'memfs';
import { EOL } from 'os';
import type { Mock } from 'vitest';
import { vi } from 'vitest';
import type { CliConfig } from '../../src/config/types';
import type { ErrorHandlers } from '../../src/error-handlers/default-error-handlers';
import { defaultErrorHandlers } from '../../src/error-handlers/default-error-handlers';
import { getContext } from '../../src/get-context';
import { getInstances } from '../../src/get-instances';
import { getPackageJsonFiles } from '../../src/get-package-json-files';
import type {
  PackageJson,
  PackageJsonFile,
} from '../../src/get-package-json-files/package-json-file';
import type { Io } from '../../src/io';
import { newlines } from '../../src/io/write-if-changed';
import type { Report } from '../../src/report';

type NodeFs = typeof fs;

type MockFn<F extends (...args: any) => any> = Mock<Parameters<F>, ReturnType<F>>;

export interface TestScenario {
  cli: Partial<CliConfig>;
  errorHandlers: ErrorHandlers;
  filesByName: Record<string, any>;
  fs: NodeFs;
  getRootPackage(): PackageJsonFile;
  getSemverReports(): Report.Semver.Any[];
  getVersionReports(): Report.Version.Group[];
  io: Io;
  mockIo: {
    cosmiconfig: Io['cosmiconfig'];
    enquirer: {
      prompt: MockFn<Io['enquirer']['prompt']>;
    };
    fs: NodeFs;
    globby: {
      sync: MockFn<Io['globby']['sync']>;
    };
    process: {
      cwd: Io['process']['cwd'];
      exit: MockFn<Io['process']['exit']>;
    };
    readYamlFile: {
      sync: MockFn<Io['readYamlFile']['sync']>;
    };
  };
  readPackages(): Record<string, PackageJson>;
}

/**
 * In order to try and write as full integration tests as possible, while still
 * remaining within Jest and being able to track code coverage, we mock as
 * little as I can think of which is solely dependencies which perform IO at the
 * very edges of the application.
 */
export function createScenario(filesByName: Record<string, any>, cli: Partial<CliConfig> = {}) {
  return function getScenario(): TestScenario {
    const mockErrorHandlers = mock.errorHandlers();
    const mockFs = mock.fs(filesByName);
    const mockIo = mock.io(mockFs, filesByName);
    const io = mockIo as unknown as Io;
    return {
      cli,
      errorHandlers: mockErrorHandlers,
      filesByName,
      fs: mockFs,
      getRootPackage(): PackageJsonFile {
        const scenario = createScenario(filesByName)();
        const config = { cli: scenario.cli, rcFile: {} };
        const [file] = Effect.runSync(getPackageJsonFiles(scenario.io, config));
        if (!file) throw new Error('Invalid Test Scenario');
        return file;
      },
      getSemverReports() {
        return Effect.runSync(
          Effect.gen(function* ($) {
            const ctx = yield* $(getContext({ io, cli, errorHandlers: mockErrorHandlers as any }));
            const { semverGroups } = yield* $(getInstances(ctx, io, mockErrorHandlers));
            const reportEffects = semverGroups.map((group) => group.inspectAll());
            const reports = yield* $(Effect.all(reportEffects));
            return reports.flat();
          }),
        );
      },
      getVersionReports() {
        return Effect.runSync(
          Effect.gen(function* ($) {
            const ctx = yield* $(getContext({ io, cli, errorHandlers: mockErrorHandlers as any }));
            const { versionGroups } = yield* $(getInstances(ctx, io, mockErrorHandlers));
            const reportEffects = versionGroups.map((group) => group.inspectAll());
            const reports = yield* $(Effect.all(reportEffects));
            return reports.flat().filter((report) => report.reports.length > 0);
          }),
        );
      },
      io,
      mockIo,
      readPackages() {
        return Object.fromEntries(
          Object.entries(filesByName)
            .filter(([path]) => path.endsWith('package.json'))
            .map(([path]) => {
              const json = mockFs
                .readFileSync(`/fake/dir/${path}`, { encoding: 'utf8' })
                .toString();
              const data = JSON.parse(json);
              return [data.name, data];
            }),
        );
      },
    };
  };
}

const mock = {
  errorHandlers(): ErrorHandlers {
    return {
      DeprecatedTypesError: mockErrorHandler('DeprecatedTypesError'),
      GlobError: mockErrorHandler('GlobError'),
      InvalidCustomTypeError: mockErrorHandler('InvalidCustomTypeError'),
      JsonParseError: mockErrorHandler('JsonParseError'),
      NoSourcesFoundError: mockErrorHandler('NoSourcesFoundError'),
      ReadFileError: mockErrorHandler('ReadFileError'),
      RenamedWorkspaceTypeError: mockErrorHandler('RenamedWorkspaceTypeError'),
      SemverGroupConfigError: mockErrorHandler('SemverGroupConfigError'),
      VersionGroupConfigError: mockErrorHandler('VersionGroupConfigError'),
      WriteFileError: mockErrorHandler('WriteFileError'),
    };

    function mockErrorHandler(name: string) {
      return vi.fn((defaultErrorHandlers as any)[name]).mockName(`defaultErrorHandlers.${name}`);
    }
  },
  fs(filesByName: Record<string, any>): NodeFs {
    const cwd = '/fake/dir';
    const jsonByPath = Object.fromEntries(
      Object.entries(filesByName).map(([path, data]) => [
        path,
        typeof data === 'string'
          ? data
          : newlines.fix(`${JSON.stringify(data, null, 2)}${EOL}`, EOL),
      ]),
    );
    const vol = Volume.fromJSON(jsonByPath, cwd);
    return createFsFromVolume(vol) as any;
  },
  io(fs: NodeFs, filesByName: Record<string, any>): TestScenario['mockIo'] {
    const cwd = '/fake/dir';
    return {
      cosmiconfig: {
        cosmiconfigSync() {
          return {
            load(configPath: string) {
              const config = filesByName[configPath];
              const filepath = `/fake/dir/${configPath}`;
              return config ? { config, filepath } : null;
            },
            search() {
              const config = filesByName['.syncpackrc'];
              const filepath = '/fake/dir/.syncpackrc';
              return config ? { config, filepath } : null;
            },
            clearLoadCache() {},
            clearSearchCache() {},
            clearCaches() {},
          };
        },
      },
      enquirer: {
        prompt: vi.fn().mockName('enquirer.prompt'),
      },
      fs: fs,
      globby: {
        sync: vi.fn(globby.sync).mockName('globby.sync') as any,
      },
      process: {
        cwd: () => cwd,
        exit: vi.fn().mockName('process.exit') as any,
      },
      readYamlFile: {
        sync: vi
          // pnpm-workspace.yaml is the only YAML file syncpack ever reads
          .fn(() => filesByName['pnpm-workspace.yaml'])
          .mockName('readYamlFile.sync') as any,
      },
    };
  },
};
