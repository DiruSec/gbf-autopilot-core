import Step from "../../Step";

exports = module.exports = (config, require, run) => (next, stop) => {
  const State = require("steps/Battle/State");
  return Step(function checkDimensionalHalo() {
    if (!config.DimensionalHalo.RetreatWhenNoDimensionalHaloTransformation) {
      return next();
    }

    return run(State()).then((state) => {
      // Not non-transforming dimensional halo
      return state.enemies[0].id != 6005070 ? next() : stop();
    });
  });
};

exports["@require"] = ["config", "require", "run"];
