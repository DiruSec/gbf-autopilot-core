import {URL} from "url";
import {locationToString} from "~/helpers/LocationHelper";
import Step from "../Step";

exports = module.exports = (env, require, run, config, logger) => (location) => {
  const CheckAP = require("steps/Quest/CheckAP");
  const CheckTreasure = require("steps/Quest/CheckTreasure");
  const Location = require("steps/Location");
  const Ajax = require("steps/Ajax");
  const Stop = require("steps/Stop");

  const url = locationToString(location);
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
    const hasReachedTarget = await run(CheckTreasure());
    if (hasReachedTarget) {
      logger.info("Treasure target reached. Stopping...");
      return await run(Stop());
    }

    await run(CheckAP(url));
    await run(Ajax(ajaxOptions));
    return await run(Location.Change(url.toString()));
  });
};

exports["@require"] = ["env", "require", "run", "config", "logger"];
