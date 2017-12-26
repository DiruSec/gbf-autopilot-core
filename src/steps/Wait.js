export default function(selector, timeout) {
  return function Wait({server, worker}) {
    server.logger.debug("Waiting element:", selector);
    return worker.sendAction("element", {selector, scroll: false, retry: true}, timeout);
  };
}
