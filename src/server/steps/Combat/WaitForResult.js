import {createProcess} from "../Helper";
import WaitForAjax from "../WaitForAjax";

export default function() {
  return createProcess("Combat.WaitForResult", function({manager}, _, done, fail) {
    this.logger.debug("Waiting for action result");
    manager.process([
      WaitForAjax(/\/rest\/(multi)?raid\/.+_result\.json/)
    ]).then(() => {
      this.logger.debug("Action result received");
      done();
    }, fail);
  });
}
