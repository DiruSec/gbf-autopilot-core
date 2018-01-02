import noop from "lodash/noop";

import coreConfig from "~/config";
import * as Location from "../../Location";
import * as Combat from "../../Combat";
import Timeout from "../../Timeout";
import Check from "../../Check";
import Step from "../../Step";

import CheckLocation from "./CheckLocation";
import CheckNextButton from "./CheckNextButton";
import CheckDimensionalHalo from "./CheckDimensionalHalo";
import RunScript from "./RunScript";

export default function Loop(env, scriptPath, count) {
  env = env || {};
  count = count || 0;
  return Step("Battle.Loop", function({manager}, $, done, fail) {
    const config = this.config;
    scriptPath = scriptPath || config.Combat.LuaScript;

    function checkAttackButton(context, location) {
      if (!location.hash.startsWith("#raid")) return false;

      return Check(".btn-attack-start.display-on")
        .call(this, context)
        .then(() => [
          Combat.Attack()
        ], noop);
    }

    const checkNextButton = CheckNextButton(() => {
      return manager.process([
        RunScript(env, scriptPath),
        Location.Get(),
        checkAttackButton
      ]);
    }, (inBattle) => {
      return inBattle ? [
        Timeout(coreConfig.redirectDelay)
      ] : false;
    });

    const checkDimensionalHalo = CheckDimensionalHalo(checkNextButton, function(context) {
      return Combat.Retreat().call(this, context);
    });

    manager.process([
      Location.Get(),
      CheckLocation(checkDimensionalHalo),
      function runSteps(context, steps) {
        if (!steps) return false;
        steps.push(Loop(env, scriptPath, ++count));
        return manager.process(steps);
      }
    ]).then(done, fail);
  }, {
    doNotTimeout: true
  });
}
