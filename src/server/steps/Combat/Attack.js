import Step from "../Step";
import {enemyAlive} from "~/server/helpers/StateHelper";

exports = module.exports = (logger, config, require, run) => () => {
  const Click = require("steps/Click");
  const Check = require("steps/Check");
  const Timeout = require("steps/Timeout");
  const State = require("steps/Battle/State");

  return Step("Combat", async function Attack() {
    try {
      await run(Check(".btn-attack-start.display-on"));
    } catch (e) {
      logger.debug("Attack button not found. Skipping attack.");
      return false;
    }

    const state = await run(State());
    if (!enemyAlive(state)) {
      logger.debug("Enemies dead. Skipping attack.");
      return false;
    }

    logger.info("Attacking...");
    await run(Click.Condition(".btn-attack-start", ".btn-attack-start.display-on"));
    await run(Timeout(config.Combat.MinWaitTimeInMsAfterAttack));
  });
};

exports["@require"] = ["logger", "config", "require", "run"];
