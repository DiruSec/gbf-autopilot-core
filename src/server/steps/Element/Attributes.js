import Step from "../Step";

exports = module.exports = (worker) => (selector, attributes) => {
  return Step("Element", async function Text() {
    return await worker.sendAction("element.attributes", {selector, attributes});
  });
};

exports["@require"] = ["worker"];
