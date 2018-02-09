import Step from "../Step";

exports = module.exports = (env, require, run, config, scenarioConfig) => (
  treasure,
  target
) => {
  const CheckItem = require("steps/Quest/CheckItem");

  return Step("Quest", async function CheckTreasure() {
    treasure =
      treasure ||
      env.treasure ||
      scenarioConfig.get("Treasure.Track") ||
      config.get("General.Treasure");
    target =
      target ||
      env.treasureTarget ||
      scenarioConfig.get("Treasure.Amount") ||
      scenarioConfig.get("Treasure.Target") ||
      Number(config.get("General.TreasureTarget"));
    if (!treasure || !target) {
      return false;
    }

    const options = {};
    if (!isNaN(treasure)) {
      options.id = Number(treasure);
    } else {
      options.name = treasure;
    }
    const count = await run(CheckItem(options));
    return count >= target;
  });
};

exports["@require"] = ["env", "require", "run", "config", "scenarioConfig"];
