import {createProcess} from "../Helper";
import WaitForAjax from "../WaitForAjax";

export default function() {
  return createProcess("Combat.WaitForResult", function({manager}) {
    this.logger.debug("Wait for action result");
    return manager.process([
      WaitForAjax(/\/rest\/raid\/.+_result\.json/)
    ]);
  });
}
