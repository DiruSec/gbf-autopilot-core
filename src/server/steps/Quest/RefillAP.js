import Step from "../Step";

exports = module.exports = (env, require, logger) => (num) => {
  num = num || 1;
  env.potUsed = env.potUsed || 0;
  const UseItem = require("steps/Quest/UseItem");
  return Step("Quest", async function RefillAP() {
    logger.debug("Refilling AP...");
    await UseItem(2, num);
    env.potUsed++;
    logger.debug("Pot used:", env.potUsed);
    return true;
  });
};

exports["@require"] = ["env", "require", "logger"];
