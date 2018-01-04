import {URL} from "url";
import Step from "../Step";
import Ajax from "../Ajax";
import RefillAP from "./RefillAP";

exports = module.exports = function(manager, env, run, url, num) {
  url = new URL(url);
  num = num || 1;
  const hash = url.hash.match(/[^\d]+(\d+)\/(\d+)/);

  return Step("Battle", async function CheckAP() {
    const user = await run(Ajax, "/quest/user_action_point");
    const quest = await run(Ajax, "/quest/quest_data/" + hash[1] + "/" + hash[2]);
    if (quest.action_point > user.action_point) {
      return await run(RefillAP, env, num);
    } else {
      return null;
    }
  });
};

exports["@require"] = ["manager", "env", "run"];
