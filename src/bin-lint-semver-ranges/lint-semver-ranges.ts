import chalk from 'chalk';
import { Context, Effect, pipe } from 'effect';
import { EOL } from 'os';
import { isNonEmptyArray } from 'tightrope/guard/is-non-empty-array';
import { CliConfigTag } from '../config/tag';
import { type CliConfig } from '../config/types';
import { ICON } from '../constants';
import type { ErrorHandlers } from '../error-handlers/default-error-handlers';
import { defaultErrorHandlers } from '../error-handlers/default-error-handlers';
import type { Ctx } from '../get-context';
import { getContext } from '../get-context';
import { getInstances } from '../get-instances';
import type { Io } from '../io';
import { IoTag } from '../io';
import { exitIfInvalid } from '../io/exit-if-invalid';
import { getSemverGroupHeader } from '../lib/get-group-header';
import { padStart } from '../lib/pad-start';
import { withLogger } from '../lib/with-logger';
import type { Report } from '../report';

interface Input {
  io: Io;
  cli: Partial<CliConfig>;
  errorHandlers?: ErrorHandlers;
}

export function lintSemverRanges({ io, cli, errorHandlers = defaultErrorHandlers }: Input) {
  return pipe(
    getContext({ io, cli, errorHandlers }),
    Effect.flatMap((ctx) => pipeline(ctx, io, errorHandlers)),
    Effect.flatMap(exitIfInvalid),
    Effect.provide(pipe(Context.empty(), Context.add(CliConfigTag, cli), Context.add(IoTag, io))),
    withLogger,
  );
}

/** Exported to be reused by `syncpack lint` */
export function pipeline(
  ctx: Ctx,
  io: Io,
  errorHandlers: ErrorHandlers,
): Effect.Effect<never, never, Ctx> {
  return Effect.gen(function* ($) {
    // no semver groups have been configured, they are disabled by default
    if (!isNonEmptyArray(ctx.config.rcFile.semverGroups)) {
      yield* $(logSemverGroupsDisabledWarning());
      return ctx;
    }

    const { semverGroups } = yield* $(getInstances(ctx, io, errorHandlers));

    let index = 0;
    for (const group of semverGroups) {
      const groupSize = group.instances.length;
      let validCount = 0;

      if (group._tag === 'Ignored') {
        yield* $(Effect.logInfo(getSemverGroupHeader({ group, index })));
        yield* $(logIgnoredSize(groupSize));
      } else if (group._tag === 'WithRange') {
        yield* $(Effect.logInfo(getSemverGroupHeader({ group, index })));
        for (const instance of group.instances) {
          const report = yield* $(group.inspect(instance));
          if (report._tag === 'SemverRangeMismatch') {
            ctx.isInvalid = true;
            yield* $(logSemverRangeMismatch(report));
          } else if (report._tag === 'UnsupportedMismatch') {
            ctx.isInvalid = true;
            yield* $(logUnsupportedMismatch(report));
          } else {
            validCount++;
          }
        }
      }
      if (validCount > 0) yield* $(logValidSize(validCount));
      index++;
    }

    return ctx;
  });
}

export function logSemverGroupsDisabledWarning() {
  return Effect.logInfo(
    [
      chalk`{red ${ICON.panic} it looks like semver ranges have not yet been configured for this project}`,
      chalk`  {red see the guide at} {yellow https://jamiemason.github.io/syncpack/guide/semver-groups}`,
    ].join(EOL),
  );
}

export function logIgnoredSize(amount: number) {
  const msg = chalk`${padStart(amount)} {dim ${ICON.skip}} ${amount} ignored`;
  return Effect.logInfo(msg);
}

function logValidSize(amount: number) {
  const msg = chalk`{green ${ICON.tick}} {dim ${amount} valid}`;
  return Effect.logInfo(msg);
}

function logSemverRangeMismatch(report: Report.SemverRangeMismatch) {
  const _tag = report._tag;
  const instance = report.fixable.instance;
  const name = instance.name;
  const actual = instance.rawSpecifier;
  const expected = report.fixable.raw;
  const propPath = instance.strategy.path;
  const filePath = instance.packageJsonFile.jsonFile.shortPath;

  return Effect.logInfo(
    chalk`{red ${ICON.cross}} ${name} {red ${actual}} {dim ${ICON.rightArrow}} {green ${expected}} {gray ${filePath} > ${propPath}} {blue [${_tag}]}`,
  );
}

function logUnsupportedMismatch(report: Report.UnsupportedMismatch) {
  const _tag = report._tag;
  const instance = report.unfixable;
  const name = instance.name;
  const actual = instance.rawSpecifier;
  const propPath = instance.strategy.path;
  const filePath = instance.packageJsonFile.jsonFile.shortPath;

  return Effect.logInfo(
    chalk`{red ${ICON.cross} name {white ${name}} or version {white ${actual}} are not supported} {gray ${filePath} > ${propPath}} {blue [${_tag}]}`,
  );
}
