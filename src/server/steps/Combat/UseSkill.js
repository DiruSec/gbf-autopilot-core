import noop from "lodash/noop";
import Step from "../Step";
import keyMap from "./keyMap";
import {enemyAlive} from "~/server/helpers/StateHelper";

exports = module.exports = (process, logger, config, coreConfig, require, run) => (num, skillNum, target, state) => {
  const Key = require("steps/Key");
  const Wait = require("steps/Wait");
  const Click = require("steps/Click");
  const Timeout = require("steps/Timeout");
  const WaitForResult = require("steps/Combat/WaitForResult");

  return Step("Combat", function UseSkill(_, $, done, fail) {
    const clickSkillTarget = async () => {
      const selector = ".pop-select-member .btn-command-character";
      await run(Wait(selector));
      await run(Timeout(coreConfig.popupDelay));
      await run(Click(selector + "[pos='" + (target-1) + "']"));
      await run(Timeout(coreConfig.popupDelay));
    };

    const steps = [
      Key.Press(num), Timeout(coreConfig.keyDelay),
      Key.Press(keyMap[skillNum]), Timeout(coreConfig.keyDelay),
      target ? clickSkillTarget : Timeout(coreConfig.popupDelay),
      Key.Press(" ")
    ];

    const doSkill = () => {
      logger.debug("Use skill:", num, skillNum, target);
      run(WaitForResult()).then(() => {
        return run(Timeout(config.Combat.MinWaitTimeInMsAfterAbility));
      }).then(() => done(true), fail);
      process(steps).then(noop, fail);
    };

    if (state) {
      if (enemyAlive(state)) {
        const chara = (state.party[num-1] || {});
        const skill = (chara.skills || [])[skillNum-1];
        const available = (skill || {}).available;
        available ? doSkill() : done(false);
      } else {
        logger.debug("Enemies dead. Skipping skill.");
        return done(false);
      }
    } else {
      doSkill();
    }
  });
};

exports["@require"] = ["process", "logger", "config", "coreConfig", "require", "run"];
