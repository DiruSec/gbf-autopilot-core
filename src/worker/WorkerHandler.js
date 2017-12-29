import TreasureEventPipeline from "~/server/Pipelines/TreasureEventPipeline";

export default function() {
  const config = this.config;
  this.on("worker.beforeStart", ({manager}) => {
    var pipeline = manager.pipeline;
    if (config.TreasureEventMode.Enabled) {
      pipeline = TreasureEventPipeline.call(this);
    }
    manager.setPipeline(pipeline);
  });
}
