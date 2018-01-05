exports = module.exports = (env, logger, process, require) => {
  if (!env.questCount) {
    env.questCount = 0;
  }

  const Location = require("steps/Location");
  const Battle = require("steps/Battle");
  const steps = [
    Location.Get(),
    (_, location) => {
      const pipeline = [];

      if (location.hash.startsWith("#raid")) {
        env.questCount++;
        pipeline.push(Battle.Loop());
      } else if (location.hash.startsWith("#quest/supporter")) {
        env.questUrl = location.hash;
        pipeline.push(Battle.Supporter());
      } else {
        if (env.questUrl) {
          logger.info("Using previous quest page:", env.questUrl);
          pipeline.push(Location.Change(env.questUrl));
        } else {
          logger.info("Waiting for supporter page...");
          pipeline.push(Location.Wait("#quest/supporter"));
        }
      }

      pipeline.push(() => {
        if (!env.maxQuest || env.questCount < env.maxQuest) {
          return process(steps);
        }
        return true;
      });
      return process(pipeline);
    }
  ];
  return steps;
};

exports["@require"] = ["env", "logger", "process", "run"];
