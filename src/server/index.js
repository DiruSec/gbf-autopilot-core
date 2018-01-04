import worker from "./worker";
import socket from "./socket";

const extensionApi = {};
const submodules = [worker, socket];

export default function server() {
  submodules.forEach((submodule) => submodule.call(this, extensionApi));
  return extensionApi;
}
