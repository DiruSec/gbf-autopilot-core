import {
  URL
} from "url";
import isString from "lodash/isString";
import Step from "../Step";

exports = module.exports = (manager, env, config, require, run, logger) => (
  options,
  num
) => {
  num = num || 1;

  var questId, type;
  if (isString(options)) options = {
    url: options
  };
  if (options.questId && options.type) {
    type = options.type;
    questId = options.questId;
  } else if (options.url) {
    const hash = new URL(options.url).hash.match(/[^\d]+(\d+)\/(\d+)/);
    questId = hash[1];
    type = hash[2];
    questDigit = hash[1].slice(0, 5);
  } else {
    throw new Error(
      "Options paramater must be either string or object with questId and type, or url"
    );
  }
  const Ajax = require("steps/Ajax");
  const Stop = require("steps/Stop");

  return Step("Battle", async function CheckAttempt() {
    const quest = await run(Ajax("/quest/quest_data/" + questDight + "/" + type + "/" + questId));
    if (quest.result != "ok") {
      logger.info("Reaching maximum attempt. Skipping...");
      return await run(exec(steps));
    } else {
      return null;
    }
  });
};

exports["@require"] = ["manager", "env", "config", "require", "run", "logger"];
