import Step from "../../Step";
import State from "../State";

exports = module.exports = function(config, run, next, stop) {
  return Step(function checkDimensionalHalo() {
    if (!config.DimensionalHalo.RetreatWhenNoDimensionalHaloTransformation) {
      return next();
    }

    return run(State).then((state) => {
      // Not non-transforming dimensional halo
      return state.enemies[0].id != 6005070 ? next() : stop();
    });
  });
};

exports["@require"] = ["config", "run"];
