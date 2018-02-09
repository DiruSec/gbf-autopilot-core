import noop from "lodash/noop";
import Step from "../Step";
import keyMap from "./keyMap";
import { enemyAlive } from "~/helpers/StateHelper";

exports = module.exports = (
  process,
  logger,
  config,
  coreConfig,
  require,
  run
) => (num, skillNum, target, state) => {
  const Key = require("steps/Key");
  const Wait = require("steps/Wait");
  const Click = require("steps/Click");
  const Location = require("steps/Location");
  const Timeout = require("steps/Timeout");
  const WaitForResult = require("steps/Combat/WaitForResult");

  return Step("Combat", function UseSkill(_, $, done, fail) {
    var hasUsedSkill = false;
    const delay = Number(config.get("Combat.MinWaitTimeInMsAfterAbility"));
    const clickSkillTarget = async () => {
      const selector = ".pop-select-member .btn-command-character";
      await run(Wait(selector));
      await run(Timeout(coreConfig.popupDelay));
      await run(Click(selector + "[pos='" + (target - 1) + "']"));
      await run(Timeout(coreConfig.popupDelay));
    };

    const steps = [
      Key.Press(num),
      Timeout(coreConfig.keyDelay),
      Key.Press(keyMap[skillNum]),
      Timeout(coreConfig.keyDelay),
      target ? clickSkillTarget : Timeout(coreConfig.popupDelay),
      Key.Press(" ")
    ];

    const finishAction = () => {
      if (hasUsedSkill) return true;
      return run(Timeout(delay)).then(() => {
        return done((hasUsedSkill = true));
      }, fail);
    };

    const doSkill = () => {
      logger.debug("Use skill:", num, skillNum, target);
      run(Location.Wait()).then(finishAction);
      run(WaitForResult()).then(finishAction);
      process(steps)
        .then(() => {
          return process([Wait(".pop-usual"), Timeout(1500)]);
        })
        .then(() => {
          if (hasUsedSkill) return true;
          return run(Key.Press(" ")).then(finishAction);
        })
        .then(noop, fail);
    };

    if (state) {
      if (enemyAlive(state)) {
        const chara = state.party[num - 1] || {};
        const skill = (chara.skills || [])[skillNum - 1];
        const available = (skill || {}).available;
        return available ? doSkill() : done(false);
      } else {
        logger.debug("Enemies dead. Skipping skill.");
        return done(false);
      }
    } else {
      logger.debug("Use skill without state!");
      return doSkill();
    }
  });
};

exports["@require"] = [
  "process",
  "logger",
  "config",
  "coreConfig",
  "require",
  "run"
];
