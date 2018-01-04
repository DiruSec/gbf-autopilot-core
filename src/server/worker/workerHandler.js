import path from "path";
import forEach from "lodash/forEach";
import config from "~/config";

export default function() {
  const resolveScript = (script) => path.resolve(config.scriptDir, script);
  const mainScript = resolveScript(config.mainScript);
  const scripts = config.scripts.map(resolveScript);

  this.on("worker.beforeStart", ({manager}) => {
    // handle the pipelines
    const plugin = config.getPlugin(this);
    const env = plugin.env = {
      scriptEnv: {},
      scriptVars: {}
    };

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

  this.on("worker.afterStop", () => {
    const plugin = config.getPlugin(this);
    const env = plugin.env || {};
    this.logger.info("AP potion used:", env.potUsed || 0);
  });

  const subscription = this.getObservable("socket.broadcast")
    .filter(({name}) => name == "userId")
    .subscribe(({payload}) => {
      const plugin = config.getPlugin(this);
      plugin.userId = payload;
      subscription.unsubscribe();
    });

  return {
    defaultPipeline: config.defaultPipeline,
    pipelines: config.pipelines,
    mainScript,
    scripts
  };
}
