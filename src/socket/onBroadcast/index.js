import forEach from "lodash/forEach";
import ajaxFinish from "./ajaxFinish";

const actionObservers = {
  ajaxFinish
};

export default function factory() {
  forEach(actionObservers, (observer, actionName) => {
    this.getObservable("socket.broadcast")
      .filter(({name}) => name == actionName)
      .subscribe(observer.bind(this));
  });
}
