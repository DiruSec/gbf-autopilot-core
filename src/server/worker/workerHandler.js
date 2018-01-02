import path from "path";
import forEach from "lodash/forEach";
import config from "~/config";

export default function() {
  const resolveScript = (script) => path.resolve(config.scriptDir, script);
  const mainScript = resolveScript(config.mainScript);
  const scripts = config.scripts.map(resolveScript);

  this.on("worker.beforeStart", ({manager}) => {
    // handle the pipelines
    const plugin = this.plugins[config.name];
    const env = {};

    var selectedPipeline = plugin.defaultPipeline;
    forEach(plugin.pipelines, (pipeline) => {
      const test = pipeline.test || function() {
        const name = pipeline.name || "<anonymous>";
        throw new Error("Non-default pipeline '" + name + "' must implement a test function!");
      };
      if (!test.call(this, env)) return;
      selectedPipeline = pipeline;
      return false;
    });
    manager.setPipeline(selectedPipeline.call(this, env));
  });

  return {
    defaultPipeline: config.defaultPipeline,
    pipelines: config.pipelines,
    mainScript,
    scripts
  };
}
