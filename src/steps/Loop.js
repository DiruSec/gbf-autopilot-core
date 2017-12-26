export default function() {
  return function Loop({manager}) {
    return manager.start();
  };
}
