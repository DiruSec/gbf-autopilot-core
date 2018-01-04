import Step from "../Step";
import Ajax from "../Ajax";

exports = module.exports = function(run, id) {
  return Step("Battle.CheckItem", async function() {
    const data = await run(Ajax, "/item/article_list_by_filter_mode");
    for (var i = 0; i < data.length; i++) {
      const item = data[i];
      if (item.item_id == id) {
        return Number(item.number);
      }
    }
    return 0;
  });
};

exports["@require"] = ["run"];
