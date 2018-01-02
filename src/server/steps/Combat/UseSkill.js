import noop from "lodash/noop";
import config from "~/config";

import {createProcess} from "../Helper";
import * as Key from "../Key";
import Timeout from "../Timeout";
import Click from "../Click";
import Wait from "../Wait";

import WaitForResult from "./WaitForResult";
import keyMap from "./keyMap";

export default function(num, skillNum, target, state) {
  return createProcess("Combat.UseSkill", function(context, $, done, fail) {
    const manager = context.manager;
    const steps = [
      Key.Press(num), Timeout(config.keyDelay),
      Key.Press(keyMap[skillNum]), Timeout(config.keyDelay),
      target ? function checkSkillTarget() {
        const selector = ".pop-select-member .btn-command-character";
        return manager.process([
          Wait(selector),
          Timeout(config.popupDelay),
          Click(selector + "[pos='" + (target-1) + "']"),
          Timeout(config.popupDelay),
        ]);
      } : Timeout(config.popupDelay),
      Key.Press(" ")
    ];
    const doSkill = () => {
      WaitForResult().call(this, context).then(() => {
        setTimeout(() => done(true), config.actionDelay);
      }, fail);
      manager.process(steps).then(noop, fail);
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
}
