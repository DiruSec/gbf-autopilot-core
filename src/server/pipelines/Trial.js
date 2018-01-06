exports = module.exports = (logger, process, require) => {
  const Location = require("steps/Location");
  const Battle = require("steps/Battle");

  const steps = [
    Location(), 
    (_, location) => {
      const pipeline = [];
      if (location.hash.startsWith("#raid")) {
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

exports.test = (config) => {
  return config.Debug.TrialBattleMode; 
};
exports.test["@require"] = ["config"];
exports["@require"] = ["logger", "process", "require"];
