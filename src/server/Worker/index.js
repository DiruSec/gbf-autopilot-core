import WorkerHandler from "./WorkerHandler";

export default function(server) {
  return {
    "worker.beforeStart": WorkerHandler(server)
  };
}
