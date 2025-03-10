import { Data, Effect, pipe } from 'effect';
import type { VersionGroupConfig } from '../config/types';
import type { Instance } from '../get-instances/instance';
import { Report } from '../report';
import { Specifier } from '../specifier';
import { groupBy } from './lib/group-by';

export class PinnedVersionGroup extends Data.TaggedClass('Pinned')<{
  config: VersionGroupConfig.Pinned;
  instances: Instance[];
}> {
  groupType = 'versionGroup';

  constructor(config: VersionGroupConfig.Pinned) {
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
      Object.entries(groupBy('name', this.instances)).map(([name, instances]) =>
        pipe(
          instances,
          Effect.forEach((instance) =>
            pipe(
              Effect.succeed(Specifier.create(instance, this.config.pinVersion)),
              Effect.map((expected) =>
                instance.rawSpecifier === expected.raw
                  ? // ✓ pinned takes precedence over any semver group
                    // ✓ current version matches expected
                    new Report.Valid({ specifier: expected })
                  : // ✓ pinned takes precedence over any semver group
                    // ✘ current version mismatches expected
                    // ✓ is a mismatch we can auto-fix
                    new Report.PinnedMismatch({ fixable: expected }),
              ),
            ),
          ),
          Effect.map((reports) => ({ name, reports })),
        ),
      ),
    );
  }
}
