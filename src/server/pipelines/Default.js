import {
  isSupporterPage,
  isBattlePage,
  locationToString,
  pageRegexp
} from "~/helpers/LocationHelper";

exports = module.exports = (
  env,
  logger,
  exec,
  require,
  scenarioConfig
) => () => {
  if (!env.questCount) {
    env.questCount = 0;
  }
  env.questUrl = env.questUrl || scenarioConfig.get("Quest.Url");

  const OpenPage = require("steps/Quest/OpenPage");
  const Location = require("steps/Location");
  const Battle = require("steps/Battle");
  const steps = [
    Location(),
    (_, location) => {
      const pipeline = [];

      if (isBattlePage(location)) {
        env.questCount++;
        pipeline.push(Battle.Loop());
      } else if (isSupporterPage(location)) {
        if (!env.questUrl) {
          env.questUrl = locationToString(location);
        }
        pipeline.push(Battle.Supporter());
      } else {
        if (env.questUrl) {
          logger.info("Using quest page:", env.questUrl);
          pipeline.push(OpenPage(env.questUrl));
        } else {
          logger.info("Waiting for supporter page...");
          pipeline.push(Location.Wait(pageRegexp.supporter));
        }
      }

      pipeline.push(() => {
        if (!env.questMax || env.questCount < env.questMax) {
          return exec(steps);
        }
        return true;
      });
      return exec(pipeline);
    }
  ];
  return steps;
};

exports["@require"] = ["env", "logger", "process", "require", "scenarioConfig"];
exports["@name"] = "Default";
