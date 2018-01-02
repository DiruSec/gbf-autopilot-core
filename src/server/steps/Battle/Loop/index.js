import noop from "lodash/noop";

import * as Location from "../../Location";
import * as Combat from "../../Combat";
import Check from "../../Check";
import Wait from "../../Wait";
import Step from "../../Step";

import CheckLocation from "./CheckLocation";
import CheckNextButton from "./CheckNextButton";
import CheckDimensionalHalo from "./CheckDimensionalHalo";
import RunScript from "./RunScript";

export default function Loop(scriptPath, env, count) {
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
        RunScript(scriptPath),
        Location.Get(),
        checkAttackButton
      ]);
    }, () => []);

    const checkDimensionalHalo = CheckDimensionalHalo(checkNextButton, function(context) {
      return Combat.Retreat().call(this, context);
    });

    manager.process([
      Location.Get(),
      CheckLocation(checkDimensionalHalo),
      function runSteps(context, steps) {
        if (!steps) return false;
        steps.push(Loop(scriptPath, env, ++count));
        return manager.process(steps);
      }
    ]).then(done, fail);
  }, {
    doNotTimeout: true
  });
}
