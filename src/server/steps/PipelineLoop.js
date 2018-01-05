import Step from "./Step";

exports = module.exports = (process) => (pipeline) => {
  return Step(function PipelineLoop() {
    return process(pipeline());
  }, {
    doNotTimeout: true
  });
};

exports["@require"] = ["process"];
