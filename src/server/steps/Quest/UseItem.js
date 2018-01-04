import Step from "../Step";
import Ajax from "../Ajax";

export default function UseItem(worker, logger, run, item_id, num) {
  num = num || 1;
  const options = {
    url: "/item/use_normal_item",
    method: "POST",
    data: JSON.stringify({
      item_id, num,
      special_token: null
    }),
  };
  return Step("Quest.UseItem", async function() {
    return await run(Ajax, options);
  });
}

exports["@require"] = ["worker", "logger", "run"];
