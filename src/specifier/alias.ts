import { Effect, pipe } from 'effect';
import type { AliasResult } from 'npm-package-arg';
import { Specifier } from '.';
import { BaseSpecifier } from './base';
import { NonSemverError } from './lib/non-semver-error';

type T = AliasResult;

/** @example "npm:imageoptim-cli@3.1.7" */
export class AliasSpecifier extends BaseSpecifier<T> {
  _tag = 'AliasSpecifier';

  /** Return the version portion if it is valid semver */
  getSemver(): Effect.Effect<never, NonSemverError, string> {
    return pipe(
      this.parse(),
      Effect.mapError(() => new NonSemverError({ specifier: this })),
      Effect.map((parsed) => parsed.subSpec),
      Effect.flatMap((subSpec) =>
        ['range', 'version'].includes(subSpec.type) && subSpec.fetchSpec !== null
          ? Effect.succeed(subSpec.fetchSpec)
          : NonSemverError.asEffect(this),
      ),
    );
  }

  /** Get a new `Specifier` from the given semver version applied to this one */
  setSemver(version: string): Effect.Effect<never, NonSemverError, Specifier.Any> {
    return pipe(
      this.parse(),
      Effect.mapError(() => new NonSemverError({ specifier: this })),
      Effect.map((parsed) => parsed.subSpec),
      Effect.map((subSpec) => subSpec.name || ''),
      Effect.map((name) => `npm:${name}@${version}`),
      Effect.map((raw) => Specifier.create(this.instance, raw)),
    );
  }
}
