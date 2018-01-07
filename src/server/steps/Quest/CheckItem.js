import Step from "../Step";

exports = module.exports = (require, run) => (id) => {
  const Ajax = require("steps/Ajax");
  return Step("Battle", async function CheckItem() {
    const data = await run(Ajax("/item/article_list_by_filter_mode"));
    for (var i = 0; i < data.length; i++) {
      const item = data[i];
      if (item.item_id == id) {
        return Number(item.number);
      }
    }
    return 0;
  });
};

exports["@require"] = ["require", "run"];
