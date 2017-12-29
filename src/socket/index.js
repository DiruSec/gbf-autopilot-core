import forEach from "lodash/forEach";
import onBroadcast from "./onBroadcast";

export const observerFactories = {
  "broadcast": onBroadcast
};

export default function() {
  forEach(observerFactories, (factory) => {
    factory.call(this);
  });
}
