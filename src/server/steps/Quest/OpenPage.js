import {URL} from "url";
import * as Location from "../Location";
import CheckAP from "../Quest/CheckAP";
import Step from "../Step";
import Ajax from "../Ajax";

export default function(run, url) {
  url = new URL(url);
  const parts = url.hash.split("/");
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
  return Step("Quest.OpenPage", async function() {
    await run(CheckAP, url);
    await run(Ajax, ajaxOptions);
    return await run(Location.Change, url.toString());
  });
}

exports["@require"] = ["run"];
