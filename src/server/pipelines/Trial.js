import {isBattlePage} from "~/helpers/LocationHelper";

exports = module.exports = (logger, process, require) => () => {
  const Location = require("steps/Location");
  const Battle = require("steps/Battle");

  const steps = [
    Location(), 
    (_, location) => {
      const pipeline = [];
      if (isBattlePage(location)) {
        pipeline.push(Battle.Loop());
      } else {
        logger.info("Waiting for trial battle page...");
        pipeline.push(Location.Wait("#raid"));
      }
      pipeline.push(() => process(steps));
      return process(pipeline);
    },
    () => logger.debug("Somehow finished")
  ];
  return steps;
};

exports.test = (config) => config.Debug.TrialBattleMode;
exports["@require"] = ["logger", "process", "require"];
exports["@name"] = "Trial";
