import Step from "../Step";

const mapping = {
  "space": " "
};

const nameMapping = {
  " ": "<space>"
};

const Press = (server, logger) => (key) => {
  return Step("Key", async function Press() {
    key = mapping[key] ? mapping[key] : key;
    const name = nameMapping[key] ? nameMapping[key] : key;
    logger.debug("Keypress:", name);
    return await server.makeRequest("key/press", {key});
  });
};
Press["@require"] = ["server", "logger"];

module.exports = {
  Press
};
