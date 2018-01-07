import Step from "../Step";

exports = module.exports = (worker) => (selector) => {
  return Step("Element", async function Text() {
    return await worker.sendAction("element.text", selector);
  });
};

exports["@require"] = ["worker"];
