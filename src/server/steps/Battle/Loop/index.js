import {createProcess} from "../../Helper";
import * as Location from "../../Location";
import * as Combat from "../../Combat";
import Wait from "../../Wait";

import CheckLocation from "./CheckLocation";
import CheckNextButton from "./CheckNextButton";
import CheckDimensionalHalo from "./CheckDimensionalHalo";
import RunScript from "./RunScript";

export default function Loop(scriptPath, env, count) {
  env = env || {};
  count = count || 0;
  return createProcess("Battle.Loop", function({manager}, $, done, fail) {
    const config = this.config;
    scriptPath = scriptPath || config.Combat.LuaScript;

    const checkNextButton = CheckNextButton(() => [
      RunScript(scriptPath),
      Combat.Attack()
    ], () => []);

    const checkDimensionalHalo = CheckDimensionalHalo(checkNextButton, () => [
      Combat.Retreat()     
    ]);

    manager.process([
      Wait(".btn-attack-start.display-on,.btn-result,.cnt-result"),
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
