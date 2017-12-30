import {createProcess} from "../Helper";
export Change from "./Change";

export default function Location() {
  return createProcess("Location", function() {
    return this.sendAction("location");
  });
}
