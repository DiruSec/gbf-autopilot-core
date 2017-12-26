export default function() {
  return function Stop({server, worker}) {
    // Since calling the worker to stop is done from inside the pipeline
    // The worker running state must be set to false to prevent deadlock
    worker.running = false;
    return server.stop();
  };
}
