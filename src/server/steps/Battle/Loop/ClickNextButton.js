import noop from "lodash/noop";
import Step from "../../Step";

exports = module.exports = (process, require, run) => () => {
  const Location = require("steps/Location");
  const Click = require("steps/Click");

  return Step(function clickNextButton() {
    return new Promise((resolve, reject) => {
      var hasChanged = false;
      run(Location.Wait(/(#raid|#result)/)).then(() => {
        hasChanged = true;
        return run(Location());
      }).then((location) => {
        if (location.hash.startsWith("#raid")) {
          return true; // still in battle
        } else {
          return false;
        }
      }).then(resolve, reject);

      run(Click.Condition(".btn-result", () => hasChanged)).then(noop, reject);
    });
  });
};

exports["@require"] = ["process", "require", "run"];
