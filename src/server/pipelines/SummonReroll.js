import {isSupporterPage, pageRegexp} from "../../helpers/LocationHelper";

exports = module.exports = (env, config, require, logger, process, run) => () => {
  const Location = require("steps/Location");
  const SummonReroll = require("steps/Support/SummonReroll");

  const summons = env.summonPreferred || config.Summons.PreferredSummons;
  const attribute = env.summonAttribute || config.Summons.DefaultSummonAttributeTab;

  const steps = [
    async () => {
      const location = await run(Location());
      if (isSupporterPage(location)) {
        return run(SummonReroll(summons, attribute, location));
      } else {
        logger.info("Waiting for supporter page...");
        return run(Location.Wait(pageRegexp.supporter)).then(() => process(steps));
      }
    }
  ];
  return steps;
};
exports["@require"] = ["env", "config", "require", "logger", "process", "run"];
exports["@name"] = "Summon Reroll";
exports.test = (config) => config.Summons.OnlyRerollSummonsEnabled;
