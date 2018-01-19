import noop from "lodash/noop";
import Step from "../../Step";

exports = module.exports = (env, process, coreConfig, config, require, run) => (scriptPath, count) => {
  const Wait = require("steps/Wait");
  const Check = require("steps/Check");
  const Click = require("steps/Click");
  const Timeout = require("steps/Timeout");
  const Combat = require("steps/Combat");
  const Location = require("steps/Location");

  const Loop = require("steps/Battle/Loop");
  const RunScript = require("steps/Battle/Loop/RunScript");
  const CheckLocation = require("steps/Battle/Loop/CheckLocation");
  const CheckNextButton = require("steps/Battle/Loop/CheckNextButton");
  const CheckDimensionalHalo = require("steps/Battle/Loop/CheckDimensionalHalo");

  const useAuto = Boolean(env.useAuto || config.Combat.UseAuto);

  count = count || 0;
  return Step("Battle.Loop", function() {
    scriptPath = scriptPath || env.luaScript || config.Combat.LuaScript;

    const clickResultScreen = () => process([
      Timeout(coreConfig.redirectDelay),
      Wait(".cnt-result"),
      Click(".btn-usual-ok"),
      Timeout(coreConfig.redirectDelay)
    ]).then(() => false);

    const checkAttackButton = (_, location) => {
      if (location.hash.startsWith("#result")) {
        return clickResultScreen();
      } else if (location.hash.startsWith("#raid")) {
        return run(Check(".btn-attack-start.display-on")).then(() => {
          return run(Combat.Attack(useAuto));
        }, noop).then(() => true);
      } else {
        return false;
      }
    };

    const runScript = () => {
      return process([
        RunScript(scriptPath),
      ]);
    };

    const checkNextButton = CheckNextButton(() => {
      return process([
        runScript,
        Location(),
        checkAttackButton
      ]);
    }, (inBattle) => {
      if (inBattle) {
        return run(Timeout(coreConfig.redirectDelay)).then(() => true);
      } else {
        return clickResultScreen();
      }
    });

    const checkDimensionalHalo = CheckDimensionalHalo(checkNextButton, () => {
      return run(Combat.Retreat()).then(() => false);
    });

    return process([
      Location(),
      CheckLocation(checkDimensionalHalo),
      function runSteps(context, inBattle) {
        if (!inBattle) return false;
        return run(Loop(scriptPath, ++count));
      }
    ]);
  }, {
    doNotTimeout: true
  });
};

exports["@require"] = ["env", "process", "coreConfig", "config", "require", "run"];
