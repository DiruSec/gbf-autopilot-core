import {createProcess} from "./Helper";

export default function(options) {
  return createProcess("Viramate", ({server, worker}) => {
    server.logger.debug("Viramate:", options);
    return worker.sendAction("viramate", options);
  });
}
