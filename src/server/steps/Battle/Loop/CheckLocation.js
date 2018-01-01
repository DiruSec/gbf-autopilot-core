import Step from "../../Step";

export default function(next) {
  return Step(function checkLocation(context, location) {
    return location.hash.startsWith("#raid") ? next.call(this, context) : false;
  });
}
