import {createProcess} from "../Helper";

const mapping = {
  "space": " "
};

const nameMapping = {
  " ": "<space>"
};

export function Press(key) {
  return createProcess("Key.Press", ({server}) => {
    key = mapping[key] ? mapping[key] : key;
    const name = nameMapping[key] ? nameMapping[key] : key;
    server.logger.debug("Keypress:", name);
    return server.makeRequest("key/press", {key});
  });
}
