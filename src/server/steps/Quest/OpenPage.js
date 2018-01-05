import {URL} from "url";
import Step from "../Step";

exports = module.exports = (require) => (url) => {
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
    await CheckAP(url);
    await Ajax(ajaxOptions);
    return await require(Location.Change, url.toString());
  });
};

exports["@require"] = ["require"];
