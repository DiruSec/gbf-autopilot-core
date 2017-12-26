export default function(timeout) {
  return function Timeout({server}, lastResult) {
    return new Promise((resolve) => {
      server.logger.debug("Timeout:", timeout);
      setTimeout(() => {
        resolve(lastResult);
      }, timeout);
    });
  };
}
