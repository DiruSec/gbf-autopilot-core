import noop from "lodash/noop";
import config from "~/config";

import {createProcess} from "../Helper";
import * as Key from "../Key";
import * as Battle from "../Battle";
import Timeout from "../Timeout";

import WaitForResult from "./WaitForResult";
import keyMap from "./keyMap";

export default function(idx) {
  return createProcess("Combat.Summon", function(context, _, done, fail) {
    const manager = context.manager;
    const doSummon = () => {
      manager.process([
        WaitForResult()
      ]).then(done, fail);
      
      manager.process([
        Key.Press("5"), Timeout(config.keyDelay),
        Key.Press(keyMap[idx]), Timeout(config.keyDelay),
        Key.Press(" ")
      ]).then(noop, fail);
    };

    Battle.State()(context).then((state) => {
      state.summons[idx-1].available ? doSummon() : done(false);
    }, fail);

  });
}
