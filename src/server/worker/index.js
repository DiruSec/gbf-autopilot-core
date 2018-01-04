import workerHandler from "./WorkerHandler";

export default function worker(extension) {
  workerHandler.call(this, extension);
}
