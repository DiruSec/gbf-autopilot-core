import Step from "../Step";

exports = module.exports = (logger, config, require, run) => () => {
  const Click = require("steps/Click");
  const Timeout = require("steps/Timeout");

  return Step("Combat", async function Attack() {
    logger.debug("Attacking...");
    await run(Click.Condition(".btn-attack-start", ".btn-attack-start.display-on"));
    await run(Timeout(config.Combat.MinWaitTimeInMsAfterAttack));
  });
};

exports["@require"] = ["logger", "config", "require", "run"];
