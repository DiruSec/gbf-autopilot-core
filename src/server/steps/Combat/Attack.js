import Step from "../Step";

exports = module.exports = (logger, config, require) => () => {
  const Click = require("steps/Click");
  const Timeout = require("steps/Timeout");

  return Step("Combat", async function Attack() {
    logger.debug("Attacking...");
    await Click.Condition(".btn-attack-start", ".btn-attack-start.display-on");
    await Timeout(config.Combat.MinWaitTimeInMsAfterAttack);
  });
};

exports["@require"] = ["logger", "config", "require"];
