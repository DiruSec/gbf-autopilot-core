import {createProcess} from "../Helper";

export function Press(key) {
  return createProcess("Key.Press", ({server}) => {
    server.logger.debug("Keypress:", key);
    return server.makeRequest("key/press", {key});
  });
}
