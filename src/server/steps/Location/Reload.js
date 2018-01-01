import {createProcess} from "../Helper";

export default function() {
  return createProcess("Location.Reload", ({server, worker}) => {
    server.logger.debug("Reloading page...");
    return worker.sendAction("location.reload");
  });
}
