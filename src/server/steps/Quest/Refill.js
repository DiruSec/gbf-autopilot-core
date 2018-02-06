import {EventEmitter} from "events";
import Step from "../Step";

module.exports = (name, itemId, callback) => {
  const emitter = new EventEmitter;
  const factory = (container, require, run) => (num) => {
    num = num || 1;
    const UseItem = require("steps/Quest/UseItem");
    return Step("Quest", async function() {
      emitter.emit("beforeRefill", container, itemId, num);
      await run(UseItem(itemId, num));
      emitter.emit("afterRefill", container, itemId, num);
      return (callback || (() => true))(container, itemId, num);
    }, {
      name: "Refill" + name
    });
  };
  factory["@require"] = ["container", "require", "run"];
  factory.on = ::emitter.on;
  return factory;
};
