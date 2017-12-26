export default function(selector, timeout) {
  return function Check({server, worker}) {
    server.logger.debug("Checking element:", selector);
    return worker.sendAction("element", {selector, scroll: false, retry: false}, timeout);
  };
}
