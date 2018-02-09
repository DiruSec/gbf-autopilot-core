import noop from "lodash/noop";
import Step from "../Step";
import { enemyAlive } from "~/helpers/StateHelper";

exports = module.exports = (
  logger,
  config,
  require,
  run,
  process
) => useAuto => {
  const Wait = require("steps/Wait");
  const Click = require("steps/Click");
  const Check = require("steps/Check");
  const Timeout = require("steps/Timeout");
  const State = require("steps/Battle/State");
  const WaitForResult = require("steps/Combat/WaitForResult");

  const attackTimeout = Number(config.get("Combat.MinWaitTimeInMsAfterAttack"));

  const checkAutoAttack = async () => {
    const state = await run(State());
    return state.auto_attack;
  };

  const doAttackAndWait = () => {
    return new Promise((resolve, reject) => {
      logger.info(useAuto ? "Auto-attacking..." : "Attacking...");
      run(WaitForResult())
        .then(() => {
          return run(Timeout(attackTimeout));
        })
        .then(() => resolve(true), reject);
      process([
        Click.Condition(".btn-attack-start.display-on"),
        () =>
          useAuto
            ? process([
              Wait(".btn-auto"),
              Click.Condition(".btn-auto", checkAutoAttack)
            ])
            : null
      ]).then(noop, reject);
    });
  };

  const checkAttack = () => {
    return run(State()).then(state => {
      if (!enemyAlive(state)) {
        logger.debug("Enemies dead. Skipping attack.");
        return false;
      }
      return doAttackAndWait();
    });
  };

  return Step("Combat", function Attack() {
    return run(Check(".btn-attack-start.display-on")).then(
      () => {
        return checkAttack();
      },
      () => {
        logger.debug("Attack button not found. Skipping attack.");
        return false;
      }
    );
  });
};

exports["@require"] = ["logger", "config", "require", "run", "process"];
