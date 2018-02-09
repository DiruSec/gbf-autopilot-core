import Step from "../Step";
import { enemyAlive } from "~/helpers/StateHelper";

exports = module.exports = (logger, require, run) => target => {
  const Click = require("steps/Click");
  const Check = require("steps/Check");
  const State = require("steps/Battle/State");

  const checkTargetArea = () => {
    const selector = ".btn-targeting.enemy-" + target;
    return run(Check(selector)).then(() => {
      return run(Click.Condition(selector, "!" + selector + ".lock-on")).then(
        () => true
      );
    }, () => false);
  };

  return Step("Combat", function Attack() {
    return run(State()).then(
      () => {
        if (enemyAlive) {
          return checkTargetArea();
        } else {
          logger.debug("Enemy not alive. Skipping targeting.");
          return false;
        }
      },
      () => {
        logger.debug("State not received. Skipping targeting.");
        return false;
      }
    );
  });
};

exports["@require"] = ["logger", "require", "run"];
