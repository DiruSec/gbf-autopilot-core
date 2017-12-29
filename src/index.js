import Worker from "./worker";
import Socket from "./socket";

const pluginApi = {};
const submodules = [Worker, Socket];

export default function() {
  submodules.forEach((submodule) => submodule.call(this));
  return pluginApi;
}
