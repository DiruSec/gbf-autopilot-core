import config from "~/config";
import {createProcess} from "../Helper";
import isString from "lodash/isString";
import Timeout from "../Timeout";

export default function(summons) {
  if (isString(summons)) {
    summons = summons.split(",").map((summon) => summon.trim());
  }
  
  return createProcess("Support.SelectSummon", function({manager}) {
    this.logger.debug("Preferred summons:", summons);
    return manager.process([
      function getSummons() {
        return this.sendAction("support", summons);
      },
      function debugSummons(_, payload) {
        this.logger.debug("Selected summon:", payload.summon);
        return payload;
      },
      Timeout(config.scrollDelay),
      function clickSummon(_, payload) {
        return this.server.makeRequest("click", payload);
      }
    ]);
  });
}
