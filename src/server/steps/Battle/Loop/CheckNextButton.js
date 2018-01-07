import Step from "../../Step";
import {enemyAlive} from "~/server/helpers/StateHelper";

exports = module.exports = (require, run) => (next, stop) => {
  const Wait = require("steps/Wait");
  const Check = require("steps/Check");
  const Location = require("steps/Location");
  const State = require("steps/Battle/State");
  const ClickNextButton = require("steps/Battle/Loop/ClickNextButton");
  const CheckNextLocation = require("steps/Battle/Loop/CheckNextLocation");
  return Step(function checkNextButton() {
    return run(State()).then((state) => {
      // check if there's still enemy left
      // if true, check for the next button
      // else, wait for the next button to appear (expected usual behavior)
      // EDIT: in cases of refreshes, it may instead redirect to the next battle or result page
      if (enemyAlive(state)) {
        return run(Check(".btn-result"));
      }

      return new Promise((resolve, reject) => {
        // resolve to false if no next button appears
        run(Location.Wait()).then(() => resolve(false), reject); 
        run(Wait(".btn-result")).then(() => resolve(true), reject);
      });
    }).then((hasNextButton) => {
      const nextAction = hasNextButton ? ClickNextButton() : CheckNextLocation();
      return run(nextAction).then(stop);
    }, next);
  });
};

exports["@require"] = ["require", "run"];
