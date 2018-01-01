import {createProcess} from "../Helper";
import UseItem from "./UseItem";

export default function RefillAP(num) {
  num = num || 1;
  return createProcess("Quest.RefillAP", function(context) {
    this.logger.debug("Refilling AP...");
    return UseItem(2, num).call(this, context);
  });
}
