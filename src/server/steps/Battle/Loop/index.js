import noop from "lodash/noop";
import Step from "../../Step";
import { isBattlePage, isResultPage } from "~/helpers/LocationHelper";

exports = module.exports = (env, process, coreConfig, config, require, run) => (
  scriptPath,
  count
) => {
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

  count = count || 0;
  if (count == 0) {
    // reset script vars
    env.scriptVars = {};
  }

  return Step(
    "Battle.Loop",
    function() {
      scriptPath =
        scriptPath || env.luaScript || config.get("Combat.LuaScript");

      const useAuto = Boolean(env.useAuto || config.get("Combat.UseAuto"));

      const clickResultScreen = () =>
        process([
          Timeout(coreConfig.redirectDelay),
          Wait(".cnt-result"),
          Click(".btn-usual-ok"),
          Timeout(coreConfig.redirectDelay)
        ]).then(() => false);

      const checkAttackButton = (_, location) => {
        if (isResultPage(location)) {
          return clickResultScreen();
        } else if (isBattlePage(location)) {
          return run(Check(".btn-attack-start.display-on"))
            .then(() => {
              return run(Combat.Attack(useAuto));
            }, noop)
            .then(() => true);
        } else {
          return false;
        }
      };

      const checkBattle = () => {
        return process([Location(), checkAttackButton]);
      };

      const checkNextButton = CheckNextButton(
        () => {
          return process([
            RunScript(scriptPath),
            (_, attack) => {
              if (attack === false) return false;
              return checkBattle();
            }
          ]);
        },
        inBattle => {
          if (inBattle) {
            return run(Timeout(coreConfig.redirectDelay)).then(() => true);
          } else {
            return clickResultScreen();
          }
        }
      );

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
    },
    {
      doNotTimeout: true
    }
  );
};

exports["@require"] = [
  "env",
  "process",
  "coreConfig",
  "config",
  "require",
  "run"
];
