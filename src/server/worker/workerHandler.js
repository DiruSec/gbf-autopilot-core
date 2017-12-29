import TreasureEventBattlePipeline from "~/server/pipelines/TreasureEvent/Battle";

const pipelines = [TreasureEventBattlePipeline];

export default function() {
  this.on("worker.beforeStart", ({manager}) => {
    pipelines.forEach((pipeline) => {
      pipeline = pipeline.call(this);
      if (!pipeline) return;
      manager.setPipeline(pipeline);
      return false;
    });
  });
}
