import Step from "../Step";

const mapping = {
  "space": " "
};

const nameMapping = {
  " ": "<space>"
};

exports = module.exports = (logger, controller) => (key) => {
  key = String(key).toLowerCase();
  key = mapping[key] ? mapping[key] : key;
  const name = nameMapping[key] ? nameMapping[key] : key;
  return Step("Key", async function Press() {
    logger.debug("Keypress:", name);
    return await controller.key_press(key);
  });
};
exports["@require"] = ["logger", "controller"];
