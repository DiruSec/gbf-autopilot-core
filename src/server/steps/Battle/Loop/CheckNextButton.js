import Check from "../../Check";
import Step from "../../Step";
import ClickNextButton from "./ClickNextButton";

exports = module.exports = function(run, next, stop) {
  return Step(function checkNextButton() {
    return run(Check, ".btn-result").then(() => {
      return run(ClickNextButton).then(stop);
    }, next);
  });
};

exports["@require"] = ["run"];
