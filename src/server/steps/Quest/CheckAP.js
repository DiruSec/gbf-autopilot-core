import {URL} from "url";
import isString from "lodash/isString";
import Step from "../Step";

exports = module.exports = (manager, env, require, run) => (options, num) => {
  num = num || 1;

  var questId, type;
  if (isString(options)) options = {url: options};
  if (options.questId && options.type) {
    type = options.type;
    questId = options.questId;
  } else if (options.url) {
    const hash = new URL(options.url).hash.match(/[^\d]+(\d+)\/(\d+)/);
    questId = hash[1];
    type = hash[2];
  } else {
    throw new Error("Options paramater must be either string or object with questId and type, or url");
  }
  const Ajax = require("steps/Ajax");
  const RefillAP = require("steps/Quest/RefillAP");

  return Step("Battle", async function CheckAP() {
    const user = await run(Ajax("/quest/user_action_point"));
    const quest = await run(Ajax("/quest/quest_data/" + questId + "/" + type));
    if (quest.action_point > user.action_point) {
      return await run(RefillAP(num));
    } else {
      return null;
    }
  });
};

exports["@require"] = ["manager", "env", "require", "run"];
