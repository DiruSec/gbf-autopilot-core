import Step from "../Step";

exports = module.exports = (logger, require) => (enable) => {
  const Battle = require("steps/Battle");
  const Key = require("steps/Key");

  return Step("Combat", async function ChargeAttack() {
    logger.debug("Charge attack:", enable);
    const state = await Battle.State();
    if ((enable && state.lock === 1) || (!enable && state.lock === 0)) {
      await Key.Press("c");
    }
  });
};

exports["@require"] = ["logger", "require"];
