import Step from "../Step";
import {locationToString} from "~/helpers/LocationHelper";

exports = module.exports = (logger, worker) => (url) => {
  url = locationToString(url);
  return Step("Location", async function Change() {
    logger.debug("Location change:", url);
    return await worker.sendAction("location.change", url);
  });
};

exports["@require"] = ["logger", "worker"];
