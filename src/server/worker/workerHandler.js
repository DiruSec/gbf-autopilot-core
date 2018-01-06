import path from "canonical-path";
import config from "~/config";

import onBeforeStart from "./events/onBeforeStart";
import onStart from "./events/onStart";
import onStop from "./events/onStop";

export default function(extension) {
  const resolveScript = (script) => path.resolve(config.scriptDir, script);
  extension.pipelines = config.pipelines;
  extension.defaultPipeline = config.defaultPipeline;
  extension.mainScript = resolveScript(config.mainScript);
  extension.scripts = config.scripts.map(resolveScript);

  this.on("worker.beforeStart", onBeforeStart(extension));
  this.on("worker.start", onStart(extension));
  this.on("worker.stop", onStop(extension));

  this.on("worker.afterSequence", ({context, sequence, result}) => {
    context.logger.debug(sequence.name, result);
  });

  const subscription = this.getObservable("socket.broadcast")
    .filter(({name}) => name == "userId")
    .subscribe(({payload}) => {
      const extension = config.getExtension(this);
      extension.userId = payload;
      subscription.unsubscribe();
    });
}
