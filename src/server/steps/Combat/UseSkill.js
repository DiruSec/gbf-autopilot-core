import config from "~/config";
import {createProcess} from "../Helper";
import WaitForAjax from "~/steps/WaitForAjax";
import Timeout from "~/steps/Timeout";
import * as Key from "~/steps/Key";

const skillMap = {
  1: "q",
  2: "w",
  3: "e",
  4: "r"
};

export default function(num, skill) {
  return createProcess("Combat.UseSkill", ({manager}) => {
    return manager.process([
      Key.Press(num),
      Timeout(config.keyDelay),
      Key.Press(skillMap[skill]),
      WaitForAjax(/\/rest\/raid\/.+_result\.json/),
      Timeout(config.keyDelay)
    ]);
  });
}
