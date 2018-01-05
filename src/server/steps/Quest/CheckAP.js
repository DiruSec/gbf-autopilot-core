import {URL} from "url";
import Step from "../Step";

exports = module.exports = (manager, env, require) => (url, num) => {
  num = num || 1;
  const hash = new URL(url).hash.match(/[^\d]+(\d+)\/(\d+)/);
  const Ajax = require("steps/Ajax");
  const RefillAP = require("steps/Quest/RefillAP");

  return Step("Battle", async function CheckAP() {
    const user = await Ajax("/quest/user_action_point");
    const quest = await Ajax("/quest/quest_data/" + hash[1] + "/" + hash[2]);
    if (quest.action_point > user.action_point) {
      return await RefillAP(num);
    } else {
      return null;
    }
  });
};

exports["@require"] = ["manager", "env", "require"];
