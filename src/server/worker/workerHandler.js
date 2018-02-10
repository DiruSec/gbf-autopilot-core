import path from "canonical-path";
import coreConfig from "~/config";

import onBeforeStart from "./events/onBeforeStart";
import onStart from "./events/onStart";
import onStop from "./events/onStop";

export default function(extension) {
  const resolveScript = script => path.resolve(coreConfig.scriptDir, script);
  extension.pipelines = coreConfig.pipelines;
  extension.defaultPipeline = coreConfig.defaultPipeline;
  extension.mainScript = resolveScript(coreConfig.mainScript);
  extension.scripts = coreConfig.scripts.map(resolveScript);

  this.on("worker.beforeStart", onBeforeStart(extension));
  this.on("worker.start", onStart(extension));
  this.on("worker.stop", onStop(extension));

  const subscription = this.getObservable("socket.broadcast")
    .filter(({ name }) => name == "userId")
    .subscribe(({ payload }) => {
      extension.userId = payload;
      subscription.unsubscribe();
    });
}
