import noop from "lodash/noop";
import {createProcess} from "../../Helper";
import * as Location from "../../Location";
import * as Combat from "../../Combat";
import Wait from "../../Wait";

import CheckLocation from "./CheckLocation";
import CheckNextButton from "./CheckNextButton";
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
    ], noop);

    manager.process([
      Wait(".btn-attack-start.display-on,.btn-result,.cnt-result"),
      Location.Get(),
      CheckLocation(checkNextButton),
      function runSteps(context, steps) {
        steps = steps || [];
        steps.push(Loop(scriptPath, env, ++count));
        return manager.process(steps);
      }
    ]).then(done, fail);
  }, {
    doNotTimeout: true
  });
}
