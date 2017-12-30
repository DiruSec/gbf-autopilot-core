import noop from "lodash/noop";
import config from "~/config";

import {createProcess} from "../Helper";
import WaitForResult from "./WaitForResult";
import * as Key from "../Key";
import Timeout from "../Timeout";
import keyMap from "./keyMap";

export default function(num, skill, state) {
  return createProcess("Combat.UseSkill", (_, $, done, fail) => {
    const doSkill = () => {
      _.manager.process([
        WaitForResult()
      ]).then(() => done(true), fail);

      _.manager.process([
        Key.Press(num), Timeout(config.keyDelay),
        Key.Press(keyMap[skill])
      ]).then(noop, fail);
    };

    if (state) {
      state.party[num-1].skills[skill-1].available ? doSkill() : done(false);
    } else {
      doSkill();
    }
  });
}
