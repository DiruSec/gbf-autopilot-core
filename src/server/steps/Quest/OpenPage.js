import {URL} from "url";
import Step from "../Step";

exports = module.exports = (require, run) => (url) => {
  const CheckAP = require("steps/Quest/CheckAP");
  const Location = require("steps/Location");
  const Ajax = require("steps/Ajax");

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
    await run(CheckAP(url));
    await run(Ajax(ajaxOptions));
    return await run(Location.Change(url.toString()));
  });
};

exports["@require"] = ["require", "run"];
