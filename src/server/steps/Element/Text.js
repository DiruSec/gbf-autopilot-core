import Step from "../Step";

export default function() {
  return Step("Element.Text", function() {
    return this.sendAction("element.text", ".btn-event-raid");
  });
}
