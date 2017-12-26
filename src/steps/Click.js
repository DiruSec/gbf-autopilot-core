export default function (selector, timeout) {
  return function Click({server, worker}) {
    return new Promise((resolve, reject) => {
      server.logger.debug("Clicking element:", selector);
      worker.sendAction("element", {selector, retry: true}, timeout).then((payload) => {
        return server.makeRequest("click", payload);
      }).then(resolve, reject);
    });
  };
}
