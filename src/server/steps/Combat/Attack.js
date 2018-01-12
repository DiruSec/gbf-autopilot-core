import noop from "lodash/noop";
import Step from "../Step";
import {enemyAlive} from "~/server/helpers/StateHelper";

exports = module.exports = (logger, config, require, run) => () => {
  const Click = require("steps/Click");
  const Check = require("steps/Check");
  const Timeout = require("steps/Timeout");
  const State = require("steps/Battle/State");
  const WaitForResult = require("steps/Combat/WaitForResult");

  const doAttackAndWait = () => {
    return new Promise((resolve, reject) => {
      logger.info("Attacking...");
      run(WaitForResult()).then(() => {
        return run(Timeout(config.Combat.MinWaitTimeInMsAfterAttack));
      }).then(resolve, reject);
      run(Click.Condition(".btn-attack-start.display-on")).then(noop, reject);
    });
  };

  const checkAttack = () => {
    return run(State()).then((state) => {
      if (!enemyAlive(state)) {
        logger.debug("Enemies dead. Skipping attack.");
        return false;
      }
      return doAttackAndWait();
    });
  };

  return Step("Combat", function Attack() {
    return run(Check(".btn-attack-start.display-on")).then(() => {
      return checkAttack();
    }, () => {
      logger.debug("Attack button not found. Skipping attack.");
      return false;
    });
  });
};

exports["@require"] = ["logger", "config", "require", "run"];
