import noop from "lodash/noop";
import * as Location from "../../Location";
import * as Click from "../../Click";
import Step from "../../Step";

exports = module.exports = function(process, run) {
  return Step(function clickNextButton() {
    return new Promise((resolve, reject) => {
      var hasChanged = false;
      run(Location.Wait, /(#raid|#result)/).then(() => {
        hasChanged = true;
        return run(Location.Get);
      }).then((location) => {
        if (location.hash.startsWith("#raid")) {
          return true; // still in battle
        } else {
          return false;
        }
      }).then(resolve, reject);

      run(Click.Condition, ".btn-result", () => hasChanged).then(noop, reject);
    });
  });
};

exports["@require"] = ["process", "run"];
