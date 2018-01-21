import {isSupporterPage, isBattlePage, locationToString} from "~/helpers/LocationHelper";

exports = module.exports = (env, logger, process, require) => () => {
  if (!env.questCount) {
    env.questCount = 0;
  }

  const OpenPage = require("steps/Quest/OpenPage");
  const Location = require("steps/Location");
  const Battle = require("steps/Battle");
  const steps = [
    Location(),
    (_, location) => {
      const pipeline = [];
      const supporterRegexp = /#(.+)\/supporter\//;

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
          pipeline.push(Location.Wait(supporterRegexp));
        }
      }

      pipeline.push(() => {
        if (!env.questMax || env.questCount < env.questMax) {
          return process(steps);
        }
        return true;
      });
      return process(pipeline);
    }
  ];
  return steps;
};

exports["@require"] = ["env", "logger", "process", "require"];
exports["@name"] = "Default";
