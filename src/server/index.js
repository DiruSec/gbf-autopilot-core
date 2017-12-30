import worker from "./worker";

const pluginApi = {};
const submodules = [worker];

export default function server() {
  submodules.forEach((submodule) => Object.assign(pluginApi, submodule.call(this)));
  return pluginApi;
}
