import {isSupporterPage, pageRegexp} from "~/helpers/LocationHelper";

exports = module.exports = (env, config, require, logger, process, run) => () => {
  const Location = require("steps/Location");
  const Support = require("steps/Support");

  const summons = env.summonPreferred || config.Summons.PreferredSummons;
  const attribute = env.summonAttribute || config.Summons.DefaultSummonAttributeTab;

  const checkLocation = () => run(Location()).then((location) => {
    if (isSupporterPage(location)) {
      return process([
        Support.SelectElement(attribute),
        Support.SelectSummon(summons, true)
      ]);
    } else {
      logger.info("Waiting for supporter page...");
      return run(Location.Wait(pageRegexp.supporter)).then(() => run(checkLocation));
    }
  });

  return [checkLocation];
};
exports["@require"] = ["env", "config", "require", "logger", "process", "run"];
exports["@name"] = "Summon Reroll";
exports.test = (config) => config.Summons.OnlyRerollSummonsEnabled;
