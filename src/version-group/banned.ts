import { Data, Effect } from 'effect';
import type { VersionGroupConfig } from '../config/types';
import type { Instance } from '../get-instances/instance';
import { Report } from '../report';
import { Specifier } from '../specifier';
import { DELETE } from './lib/delete';
import { groupBy } from './lib/group-by';

export class BannedVersionGroup extends Data.TaggedClass('Banned')<{
  config: VersionGroupConfig.Banned;
  instances: Instance[];
}> {
  groupType = 'versionGroup';

  constructor(config: VersionGroupConfig.Banned) {
    super({
      config,
      instances: [],
    });
  }

  canAdd(_: Instance): boolean {
    return true;
  }

  inspectAll(): Effect.Effect<never, never, Report.Version.Group[]> {
    return Effect.succeed(
      Object.entries(groupBy('name', this.instances)).map(([name, instances]) => ({
        name,
        reports: instances.map(
          (instance) =>
            // ✘ package should not be used
            // ✓ is a mismatch we can auto-fix
            new Report.Banned({
              fixable: Specifier.create(instance, DELETE),
            }),
        ),
      })),
    );
  }
}
