import Step from "../Step";

exports = module.exports = function(worker) {
  return Step("Element", async function Text() {
    return await worker.sendAction("element.text", ".btn-event-raid");
  });
};

exports["@require"] = ["worker"];
