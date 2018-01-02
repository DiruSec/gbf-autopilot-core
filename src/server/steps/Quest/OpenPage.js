import {URL} from "url";
import * as Location from "../Location";
import CheckAP from "../Quest/CheckAP";
import Step from "../Step";
import Ajax from "../Ajax";

export default function(env, url) {
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
  return Step("Quest.OpenPage", function({manager}) {
    return manager.process([
      CheckAP(env, url),
      Ajax(ajaxOptions),
      Location.Change(url.toString()),
    ]);
  });
}
