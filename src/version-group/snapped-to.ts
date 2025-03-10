import { Data, Effect, pipe } from 'effect';
import type { VersionGroupConfig } from '../config/types';
import type { Instance } from '../get-instances/instance';
import { Report } from '../report';
import { Specifier } from '../specifier';
import { groupBy } from './lib/group-by';

export class SnappedToVersionGroup extends Data.TaggedClass('SnappedTo')<{
  config: VersionGroupConfig.SnappedTo;
  instances: Instance[];
}> {
  groupType = 'versionGroup';

  constructor(config: VersionGroupConfig.SnappedTo) {
    super({
      config,
      instances: [],
    });
  }

  canAdd(_: Instance): boolean {
    return true;
  }

  inspectAll(): Effect.Effect<never, never, Report.Version.Group[]> {
    return Effect.all(
      Object.entries(groupBy('name', this.instances)).flatMap(([name, instances]) =>
        pipe(
          findSnappedToInstance(name, this.config.snapTo, instances),
          Effect.matchEffect({
            onFailure: () =>
              Effect.succeed(
                instances.map(
                  (instance) =>
                    // ✘ none of the snapTo packages contain this dependency
                    // ✘ is a user configuration error we can't auto-fix
                    new Report.MissingSnappedToMismatch({ unfixable: instance }),
                ),
              ),
            onSuccess: (expected) =>
              pipe(
                instances,
                Effect.forEach((instance) =>
                  pipe(
                    Effect.Do,
                    Effect.bind('specifier', () =>
                      Effect.succeed(Specifier.create(instance, instance.rawSpecifier)),
                    ),
                    Effect.bind('expected', () =>
                      Effect.succeed(Specifier.create(instance, expected.rawSpecifier)),
                    ),
                    Effect.flatMap(({ expected, specifier }) =>
                      pipe(
                        expected.getSemver(),
                        Effect.matchEffect({
                          onFailure: () =>
                            pipe(
                              specifier.replaceWith(expected),
                              specifier.instance.semverGroup.getFixed,
                              Effect.match({
                                onFailure: () =>
                                  // ✘ expected version is not semver
                                  // ✘ semver group expects semver
                                  // ✘ is a mismatch we can't auto-fix
                                  new Report.UnsupportedMismatch({
                                    unfixable: specifier.instance,
                                  }),
                                onSuccess: (valid) =>
                                  specifier.instance.rawSpecifier === valid.raw
                                    ? // ! expected version is not semver
                                      // ✓ semver group is disabled/ignored
                                      // ✓ current version matches expected
                                      new Report.Valid({ specifier })
                                    : // ! expected version is not semver
                                      // ✓ semver group is disabled/ignored
                                      // ✘ current version mismatches expected
                                      // ✓ is a mismatch we can auto-fix by replacing with the non-semver version
                                      new Report.SnappedToMismatch({
                                        fixable: valid,
                                        localInstance: expected.instance,
                                      }),
                              }),
                            ),
                          onSuccess: () =>
                            pipe(
                              specifier.replaceWith(expected),
                              specifier.instance.semverGroup.getFixed,
                              Effect.match({
                                onFailure: /* istanbul ignore next */ () =>
                                  // ✓ expected version is semver
                                  // ✘ expected version is not fixable by its semver group
                                  // ✘ is a mismatch we can't auto-fix
                                  // ✘ this should be impossible - we already proved the local version is exact semver
                                  new Report.UnsupportedMismatch({
                                    unfixable: specifier.instance,
                                  }),
                                onSuccess: (valid) =>
                                  specifier.instance.rawSpecifier === valid.raw
                                    ? // ✓ expected version is semver
                                      // ✓ expected version matches its semver group
                                      // ✓ current version matches expected
                                      new Report.Valid({ specifier })
                                    : // ✓ expected version is semver
                                      // ✓ expected version matches its semver group
                                      // ✘ current version mismatches expected
                                      // ✓ is a mismatch we can auto-fix
                                      new Report.SnappedToMismatch({
                                        fixable: valid,
                                        localInstance: expected.instance,
                                      }),
                              }),
                            ),
                        }),
                      ),
                    ),
                  ),
                ),
              ),
          }),
          Effect.map((reports) => ({ name, reports })),
        ),
      ),
    );
  }
}

function findSnappedToInstance(
  name: string,
  snapTo: string[],
  instances: Instance[],
): Effect.Effect<never, string, Instance> {
  for (const instance of instances) {
    if (snapTo.includes(instance.pkgName) && instance.rawSpecifier) {
      return pipe(
        Effect.succeed(instance),
        Effect.tap(() =>
          Effect.logDebug(
            `found snapped to version ${instance.rawSpecifier} for ${name} in <${instance.packageJsonFile.jsonFile.shortPath}>`,
          ),
        ),
      );
    }
  }
  return pipe(
    Effect.fail('getSnappedTo found nothing'),
    Effect.tapError(() =>
      Effect.logError(
        `failed to get snapped to version for ${name} using ${JSON.stringify(snapTo)}`,
      ),
    ),
  );
}
