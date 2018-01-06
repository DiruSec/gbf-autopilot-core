import Step from "../../Step";

exports = module.exports = (require, run) => (next, stop) => {
  const Check = require("steps/Check");
  const ClickNextButton = require("steps/Battle/Loop/ClickNextButton");
  return Step(function checkNextButton() {
    return run(Check(".btn-result")).then(() => {
      return run(ClickNextButton()).then(stop);
    }, next);
  });
};

exports["@require"] = ["require", "run"];
