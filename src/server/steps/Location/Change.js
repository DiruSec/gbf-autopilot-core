import Step from "../Step";

exports = module.exports = function(logger, worker, url) {
  return Step("Location", async function Change() {
    logger.debug("Location change:", url);
    return await worker.sendAction("location.change", url);
  });
};

exports["@require"] = ["logger", "worker"];
