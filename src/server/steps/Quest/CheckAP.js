import {URL} from "url";
import Step from "../Step";
import Ajax from "../Ajax";
import RefillAP from "./RefillAP";

export default function(env, url, num) {
  url = new URL(url);
  num = num || 1;
  const hash = url.hash.match(/[^\d]+(\d+)\/(\d+)/);
  return Step("Battle.CheckAP", function({manager}) {
    function maybeRefillAP(context, {user, quest}) {
      if (quest.action_point > user.action_point) {
        return RefillAP(env, num).call(this, context);
      } else {
        return null;
      }
    }

    var userData;
    return manager.process([
      Ajax("/quest/user_action_point"),
      function setUserData(_, data) {
        return userData = data;
      },
      Ajax("/quest/quest_data/" + hash[1] + "/" + hash[2]),
      function composeData(_, questData) {
        return {
          user: userData,
          quest: questData
        };
      },
      maybeRefillAP
    ]);
  });
}
