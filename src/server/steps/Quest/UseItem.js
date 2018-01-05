import Step from "../Step";

exports = module.exports = (worker, logger, require) => (item_id, num) => {
  const Ajax = require("steps/Ajax");

  num = num || 1;
  const options = {
    url: "/item/use_normal_item",
    method: "POST",
    data: JSON.stringify({
      item_id, num,
      special_token: null
    }),
  };
  return Step("Quest", function UseItem() {
    return Ajax(options);
  });
};

exports["@require"] = ["worker", "logger", "require"];
