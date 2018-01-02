import {createProcess} from "../Helper";
import UseItem from "./UseItem";

export default function RefillAP(env, num) {
  num = num || 1;
  env.potUsed = env.potUsed || 0;
  return createProcess("Quest.RefillAP", function(context) {
    this.logger.debug("Refilling AP...");
    return UseItem(2, num)
      .call(this, context)
      .then(() => {
        env.potUsed++;
        this.logger.debug("Pot used:", env.potUsed);
        return true;
      });
  });
}
