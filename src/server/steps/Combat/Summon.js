import noop from "lodash/noop";
import keyMap from "./keyMap";
import Step from "../Step";
import {enemyAlive} from "~/server/helpers/StateHelper";

exports = module.exports = (require, logger, process, config, run) => (idx, state) => {
  const WaitForResult = require("steps/Combat/WaitForResult");
  const Timeout = require("steps/Timeout");
  const Key = require("steps/Key");

  return Step("Combat", function Summon(_, $, done, fail) {
    const doSummon = () => {
      run(WaitForResult()).then(() => {
        return run(Timeout(config.Combat.MinWaitTimeInMsAfterSummon));
      }).then(() => done(true), fail);

      process([
        Key.Press("5"), Timeout(config.keyDelay),
        Key.Press(keyMap[idx]), Timeout(config.keyDelay),
        Key.Press(" ")
      ]).then(noop, fail);
    };

    if (state) {
      if (enemyAlive(state)) {
        const summon = (state.summons[idx-1] || {});
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

exports["@require"] = ["require", "logger", "process", "coreConfig", "run"];
