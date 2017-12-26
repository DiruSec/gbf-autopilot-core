export default function() {
  return function Loop({worker, manager}) {
    worker.running = false;
    return manager.start();
  };
}
