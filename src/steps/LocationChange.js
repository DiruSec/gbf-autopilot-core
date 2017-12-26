export default function(url) {
  return function LocationChange({server, worker}) {
    server.logger.debug("Location change:", url);
    return worker.sendAction("location.change", url);
  };
}
