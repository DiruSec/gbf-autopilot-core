import noop from "lodash/noop";
import Step from "../../Step";

exports = module.exports = (env, process, coreConfig, config, require) => (scriptPath, count) => {
  const Wait = require("steps/Wait");
  const Check = require("steps/Check");
  const Click = require("steps/Click");
  const Timeout = require("steps/Timeout");
  const Combat = require("steps/Combat");
  const Location = require("steps/Location");

  const RunScript = require("steps/Battle/Loop/RunScript");
  const CheckLocation = require("steps/Battle/Loop/CheckLocation");
  const CheckNextButton = require("steps/Battle/Loop/CheckNextButton");
  const CheckDimensionalHalo = require("steps/Battle/Loop/CheckDimensionalHalo");

  count = count || 0;
  return Step("Battle", function Loop(_, $, done, fail) {
    scriptPath = scriptPath || env.luaScript || config.Combat.LuaScript;

    const checkAttackButton = (_, location) => {
      if (!location.hash.startsWith("#raid")) return false;
      return Check(".btn-attack-start.display-on").then(() => [Combat.Attack()], noop);
    };

    const checkNextButton = CheckNextButton(() => {
      return process([
        RunScript(scriptPath),
        Location.Get(),
        checkAttackButton
      ]);
    }, (inBattle) => {
      return inBattle ? [
        Timeout(coreConfig.redirectDelay),
      ] : process([
        Timeout(coreConfig.redirectDelay),
        Wait(".cnt-result"),
        Click(".btn-usual-ok"),
        Timeout(coreConfig.redirectDelay)
      ]).then(() => false);
    });

    const checkDimensionalHalo = CheckDimensionalHalo(checkNextButton, () => Combat.Retreat());

    process([
      Location.Get(),
      CheckLocation(checkDimensionalHalo),
      function runSteps(context, steps) {
        if (!steps) return false;
        const Loop = require("steps/Battle/Loop");
        steps.push(Loop(scriptPath, ++count));
        return process(steps);
      }
    ]).then(done, fail);
  }, {
    doNotTimeout: true
  });
};

exports["@require"] = ["env", "process", "coreConfig", "config", "require"];
