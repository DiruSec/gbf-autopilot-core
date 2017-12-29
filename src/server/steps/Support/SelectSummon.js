import config from "~/config";
import {createProcess} from "../Helper";
import isString from "lodash/isString";
import Timeout from "../Timeout";

export default function(summons) {
  if (isString(summons)) {
    summons = summons.split(",").map((summon) => summon.trim());
  }
  
  return createProcess("Support.SelectSummon", ({manager}) => {
    return manager.process([
      function getSummons({worker}) {
        return worker.sendAction("support", summons);
      },
      function debugSummons({server}, payload) {
        server.logger.debug("Selected summon:", payload.summon);
        return payload;
      },
      Timeout(config.scrollDelay),
      function clickSummon({server}, payload) {
        return server.makeRequest("click", payload);
      }
    ]);
  });
}
