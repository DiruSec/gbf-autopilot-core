exports = module.exports = (server, manager) => () => {
  return function Stop() {
    // Since calling the worker to stop is done from inside the pipeline
    // The worker running state must be set to false to prevent deadlock
    // manager.running = false;
    return manager.stop();
  };
};

exports["@require"] = ["server", "manager"];
