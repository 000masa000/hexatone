import { WebMidi } from "webmidi";

export let midi_in = WebMidi
  .enable()
  .then(onEnabled)
  .catch(err => alert(err));

function onEnabled() {
  console.log("webmidi on"); //post to console if WebMidi enabled

  // Inputs
  WebMidi.inputs.forEach(input => console.log(input.manufacturer, input.name, input.id));
  
  // Outputs
  WebMidi.outputs.forEach(output => console.log(output.manufacturer, output.name, output.id));

  // create the global midi_in stream from all inputs, to be processed in ./keyboard/keys.js
  // TODO connect to MIDI-INPUT selector
  midi_in = WebMidi.inputs;
};
