import workerHandler from "./WorkerHandler";

export default function worker() {
  return workerHandler.call(this);
}
