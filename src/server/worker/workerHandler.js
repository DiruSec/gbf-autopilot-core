import forEach from "lodash/forEach";
import TreasureEventPipeline from "~/server/pipelines/TreasureEvent";
import EventPipeline from "~/server/pipelines/Event";
import DefaultPipeline from "~/server/pipelines/Default";

const pipelines = [
  TreasureEventPipeline,
  EventPipeline,
  DefaultPipeline
];

export default function() {
  this.on("worker.beforeStart", ({manager}) => {
    const env = {};
    forEach(pipelines, (pipeline) => {
      pipeline = pipeline.call(this, env);
      if (!pipeline) return;
      manager.setPipeline(pipeline);
      return false;
    });
  });
}
