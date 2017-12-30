import TreasureEventPipeline from "~/server/pipelines/TreasureEvent";
import DefaultPipeline from "~/server/pipelines/Default";

const pipelines = [
  TreasureEventPipeline,
  DefaultPipeline
];

export default function() {
  this.on("worker.beforeStart", ({manager}) => {
    const context = {};
    pipelines.forEach((pipeline) => {
      pipeline = pipeline.call(this, context);
      if (!pipeline) return;
      manager.setPipeline(pipeline);
      return false;
    });
  });
}
