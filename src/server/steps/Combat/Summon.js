import noop from "lodash/noop";
import keyMap from "./keyMap";
import Step from "../Step";
import { enemyAlive } from "~/helpers/StateHelper";

exports = module.exports = (
  require,
  logger,
  process,
  config,
  coreConfig,
  run
) => (idx, state) => {
  const WaitForResult = require("steps/Combat/WaitForResult");
  const Timeout = require("steps/Timeout");
  const Key = require("steps/Key");

  const summonTimeout = Number(config.get("Combat.MinWaitTimeInMsAfterSummon"));

  return Step("Combat", function Summon(_, $, done, fail) {
    const doSummon = () => {
      run(WaitForResult())
        .then(() => {
          return run(Timeout(summonTimeout));
        })
        .then(() => done(true), fail);

      process([
        Key.Press("5"),
        Timeout(coreConfig.popupDelay),
        Key.Press(keyMap[idx]),
        Timeout(coreConfig.popupDelay),
        Key.Press(" ")
      ]).then(noop, fail);
    };

    if (state) {
      if (enemyAlive(state)) {
        const summon = state.summons[idx - 1] || {};
        summon.available ? doSummon() : done(false);
      } else {
        logger.debug("Enemies dead. Skipping summon.");
        done(false);
      }
    } else {
      doSummon();
    }
  });
};

exports["@require"] = [
  "require",
  "logger",
  "process",
  "config",
  "coreConfig",
  "run"
];
