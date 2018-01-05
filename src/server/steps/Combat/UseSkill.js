import noop from "lodash/noop";
import Step from "../Step";
import keyMap from "./keyMap";

exports = module.exports = (process, config, coreConfig, require) => (num, skillNum, target, state) => {
  const Key = require("steps/Key");
  const Wait = require("steps/Wait");
  const Click = require("steps/Click");
  const Timeout = require("steps/Timeout");
  const WaitForResult = require("steps/Combat/WaitForResult");

  return Step("Combat", function UseSkill(_, $, done, fail) {
    const clickSkillTarget = async () => {
      const selector = ".pop-select-member .btn-command-character";
      await Wait(selector);
      await Timeout(coreConfig.popupDelay);
      await Click(selector + "[pos='" + (target-1) + "']");
      await Timeout(coreConfig.popupDelay);
    };

    const steps = [
      Key.Press(num), Timeout(coreConfig.keyDelay),
      Key.Press(keyMap[skillNum]), Timeout(coreConfig.keyDelay),
      target ? clickSkillTarget : Timeout(coreConfig.popupDelay),
      Key.Press(" ")
    ];

    const doSkill = () => {
      WaitForResult().then(() => {
        return Timeout(config.Combat.MinWaitTimeInMsAfterAbility);
      }).then(done, fail);
      process(steps).then(noop, fail);
    };

    if (state) {
      const chara = (state.party[num-1] || {});
      const skill = (chara.skills || [])[skillNum-1];
      const available = (skill || {}).available;
      available ? doSkill() : done(false);
    } else {
      doSkill();
    }
  });
};

exports["@require"] = ["process", "config", "coreConfig", "require"];
