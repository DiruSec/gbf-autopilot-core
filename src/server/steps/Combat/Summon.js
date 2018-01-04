import noop from "lodash/noop";
import config from "~/config";

import * as Key from "../Key";
import Timeout from "../Timeout";
import Step from "../Step";

import WaitForResult from "./WaitForResult";
import keyMap from "./keyMap";

exports = module.exports = function(run, process, idx, state) {
  return Step("Combat", function Summon(_, $, done, fail) {
    const doSummon = () => {
      run(WaitForResult).then(done, fail);

      process([
        [Key.Press, "5"], [Timeout, config.keyDelay],
        [Key.Press, keyMap[idx]], [Timeout, config.keyDelay],
        [Key.Press, " "]
      ]).then(noop, fail);
    };

    if (state) {
      const summon = (state.summons[idx-1] || {});
      summon.available ? doSummon() : done(false);
    } else {
      doSummon();
    }
  });
};

exports["@require"] = ["run", "process"];
