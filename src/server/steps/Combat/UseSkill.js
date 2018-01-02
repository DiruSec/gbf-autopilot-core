import noop from "lodash/noop";
import config from "~/config";

import {createProcess} from "../Helper";
import * as Key from "../Key";
import Timeout from "../Timeout";
import Click from "../Click";
import Wait from "../Wait";

import WaitForResult from "./WaitForResult";
import keyMap from "./keyMap";

export default function(num, skill, target, state) {
  return createProcess("Combat.UseSkill", function(context, $, done, fail) {
    const manager = context.manager;
    const steps = [
      Key.Press(num), Timeout(config.keyDelay),
      Key.Press(keyMap[skill]), Timeout(config.keyDelay),
      target ? function checkSkillTarget() {
        const selector = ".pop-select-member .btn-command-character";
        return manager.process([
          Wait(selector),
          Timeout(config.popupDelay),
          Click(selector + "[pos='" + (target-1) + "']")
        ]);
      } : noop
    ];
    const doSkill = () => {
      WaitForResult().call(this, context).then(() => done(true), fail);
      manager.process(steps).then(noop, fail);
    };

    if (state) {
      state.party[num-1].skills[skill-1].available ? doSkill() : done(false);
    } else {
      doSkill();
    }
  });
}
