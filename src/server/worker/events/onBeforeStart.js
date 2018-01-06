import coreConfig from "~/config";
import forEach from "lodash/forEach";
import WorkerContainer from "../workerContainer";

export default function(extension) {
  return function onBeforeStart(context) {
    const env = {
      scriptEnv: {},
      scriptVars: {}
    };

    const container = context.container = new WorkerContainer(context);
    container.register("coreConfig", coreConfig)
      .register("extension", extension)
      .register("env", env);

    var selectedPipeline; 
    forEach(extension.pipelines, (pipeline) => {
      if (typeof pipeline !== "function") {
        throw new Error("Pipeline must be a function!");
      }

      const passed = container.inject(pipeline.test || function() {
        const name = pipeline.name || "<anonymous>";
        throw new Error("Non-default pipeline '" + name + "' must implement a test function!");
      });

      if (passed) {
        selectedPipeline = container.inject(pipeline);
        return false;
      }
    });

    env.pipeline = selectedPipeline || container.inject(extension.defaultPipeline);
  };
}
