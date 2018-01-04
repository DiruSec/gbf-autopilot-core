import Step from "./Step";

exports = module.exports = function PipelineLoop(env, manager, pipeline) {
  return Step(function PipelineLoop() {
    return manager.process(pipeline());
  }, {
    doNotTimeout: true
  });
};

exports["@require"] = ["env", "manager"];
