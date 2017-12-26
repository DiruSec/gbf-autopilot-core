import {createProcess} from "../Helper";

export default function(url) {
  return createProcess("Location.Change", ({server, worker}) => {
    server.logger.debug("Location change:", url);
    return worker.sendAction("location.change", url);
  });
}
