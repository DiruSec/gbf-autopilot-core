import path from "canonical-path";
import config from "~/config";

import onBeforeStart from "./events/onBeforeStart";
import onStart from "./events/onStart";
import onStop from "./events/onStop";

export default function(extension) {
  const resolveScript = (script) => path.resolve(config.scriptDir, script);
  extension.defaultPipeline = config.defaultPipeline;
  extension.pipelines = config.pipelines;
  extension.mainScript = resolveScript(config.mainScript);
  extension.scripts = config.scripts.map(resolveScript);

  this.on("worker.beforeStart", onBeforeStart(extension));
  this.on("worker.start", onStart(extension));
  this.on("worker.stop", onStop(extension));

  const subscription = this.getObservable("socket.broadcast")
    .filter(({name}) => name == "userId")
    .subscribe(({payload}) => {
      const extension = config.getExtension(this);
      extension.userId = payload;
      subscription.unsubscribe();
    });
}
