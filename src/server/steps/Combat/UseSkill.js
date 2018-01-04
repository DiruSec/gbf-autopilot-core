import noop from "lodash/noop";

import {Step} from "../Helper";
import * as Key from "../Key";
import Timeout from "../Timeout";
import Click from "../Click";
import Wait from "../Wait";

import WaitForResult from "./WaitForResult";
import keyMap from "./keyMap";

exports = module.exports = function(process, run, config, num, skillNum, target, state) {
  return Step("Combat", function UseSkill(_, $, done, fail) {
    const checkSkillTarget = async () => {
      const selector = ".pop-select-member .btn-command-character";
      return await process([
        [Wait, selector],
        [Timeout, config.popupDelay],
        [Click, selector + "[pos='" + (target-1) + "']"],
        [Timeout, config.popupDelay],
      ]);
    };

    const steps = [
      [Key.Press, num], [Timeout, config.keyDelay],
      [Key.Press, keyMap[skillNum]], [Timeout, config.keyDelay],
      target ? checkSkillTarget : [Timeout, config.popupDelay],
      [Key.Press, " "]
    ];

    const doSkill = () => {
      run(WaitForResult).then(() => {
        setTimeout(() => done(true), config.actionDelay);
      }, fail);
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

exports["@require"] = ["process", "run", "coreConfig"];
