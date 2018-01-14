import {URL} from "url";
import Step from "../Step";

exports = module.exports = (env, require, run, config, logger) => (url) => {
  const CheckAP = require("steps/Quest/CheckAP");
  const CheckItem = require("steps/Quest/CheckItem");
  const Location = require("steps/Location");
  const Ajax = require("steps/Ajax");
  const Stop = require("steps/Stop");

  const parts = new URL(url).hash.split("/");
  const ajaxOptions = {
    url: "/quest/set_return_point",
    method: "POST",
    data: {
      page: 1,
      questId: parts[2],
      returnPoint: null,
      special_token: null
    },
    dataType: "json"
  };
  return Step("Quest", async function OpenPage() {
    const treasureId = env.treasureId || config.General.TreasureId;
    const treasureTarget = env.treasureTarget || Number(config.General.TreasureTarget);
    if (treasureId && treasureTarget > 0) {
      const treasureCount = await run(CheckItem(treasureId));
      if (treasureCount >= treasureTarget) {
        logger.info("Treasure target reached. Stopping...");
        return await run(Stop());
      }
    }

    await run(CheckAP(url));
    await run(Ajax(ajaxOptions));
    return await run(Location.Change(url.toString()));
  });
};

exports["@require"] = ["env", "require", "run", "config", "logger"];
