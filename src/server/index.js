import worker from "./worker";
import socket from "./socket";

const pluginApi = {};
const submodules = [worker, socket];

export default function server() {
  submodules.forEach((submodule) => Object.assign(pluginApi, submodule.call(this)));
  return pluginApi;
}
