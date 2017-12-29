import forEach from "lodash/forEach";
import onBroadcast from "./onBroadcast";

export const observerFactories = {
  "broadcast": onBroadcast
};

export default function socket() {
  forEach(observerFactories, (factory) => factory.call(this));
  return {};
}
