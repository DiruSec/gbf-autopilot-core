export default function() {
  return function Location({worker}) {
    return worker.sendAction("location");
  };
}
