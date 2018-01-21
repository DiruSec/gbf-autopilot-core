import Step from "../../Step";
import {isBattlePage} from "~/helpers/LocationHelper";

exports = module.exports = (require, run) => () => {
  const Location = require("steps/Location");
  return Step(async function checkNextLocation() {
    // check if we're still in battle for the next page redirection
    const location = await run(Location());
    return isBattlePage(location);
  });
};
exports["@require"] = ["require", "run"];
