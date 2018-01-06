import Step from "../Step";

exports = module.exports = (logger, require, run) => (enable) => {
  const Battle = require("steps/Battle");
  const Key = require("steps/Key");

  return Step("Combat", function ChargeAttack() {
    logger.debug("Charge attack:", enable);
    return run(Battle.State()).then((state) => {
      if ((enable && state.lock === 1) || (!enable && state.lock === 0)) {
        return run(Key.Press("c"));
      } else {
        return true;
      }
    });
  });
};

exports["@require"] = ["logger", "require", "run"];
