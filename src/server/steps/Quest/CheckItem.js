import Step from "../Step";

exports = module.exports = (require, run) => (options) => {
  if (typeof options !== "object") {
    options = {id: options};
  }
  if (options.name) options.name = options.name.toLowerCase();
  const Ajax = require("steps/Ajax");
  return Step("Battle", async function CheckItem() {
    const data = await run(Ajax("/item/article_list_by_filter_mode"));
    for (var i = 0; i < data.length; i++) {
      const item = data[i];
      const name = item.name.toLowerCase();
      const valid = (options.id && item.item_id == options.id) ||
        (options.name && name.indexOf(options.name) >= 0);
      if (valid) {
        return Number(item.number);
      }
    }
    return 0;
  });
};

exports["@require"] = ["require", "run"];
