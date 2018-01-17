import Step from "../Step";

exports = module.exports = (require, process) => (row, col) => {
  const Wait = require("steps/Wait");
  const Click = require("steps/Click");
  return Step("Combat", function UseSticker() {
    return process([
      Wait(".btn-chat.display-on"),
      Click.Condition(".btn-chat.display-on", "!.pop-usual.pop-ready-stamp"),
      Click.Condition([
        ".lis-stamp-row:nth-child(" + row + ")",
        ".lis-stamp:nth-child(" + col + ")"
      ].join(" "), ".pop-usual.pop-ready-stamp")
    ]);
  });
};
exports["@require"] = ["require", "process"];
