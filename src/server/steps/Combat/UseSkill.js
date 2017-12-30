import noop from "lodash/noop";
import config from "~/config";

import {createProcess} from "../Helper";
import WaitForResult from "./WaitForResult";
import * as Key from "../Key";
import * as Battle from "../Battle";
import Timeout from "../Timeout";
import keyMap from "./keyMap";

export default function(num, skill) {
  return createProcess("Combat.UseSkill", (context, _, done, fail) => {
    const manager = context.manager;
    const doSkill = () => {
      manager.process([
        WaitForResult()
      ]).then(done, fail);

      manager.process([
        Key.Press(num), Timeout(config.keyDelay),
        Key.Press(keyMap[skill])
      ]).then(noop, fail);
    };

    Battle.State()(context).then((state) => {
      state.party[num-1].skills[skill-1].available ?
        doSkill() : done(false);
    }, fail);
  });
}
