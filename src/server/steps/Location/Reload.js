import Step from "../Step";

exports = module.exports = (logger, worker) => () => {
  return Step("Location", function Reload() {
    logger.debug("Reloading page...");
    return worker.sendAction("location.reload");
  });
};

exports["@require"] = ["logger", "worker"];
