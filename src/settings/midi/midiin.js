import { WebMidi } from "webmidi";

export var midi_in = [];

WebMidi
.enable()
.then(onEnabled)
.catch(err => alert(err));

function onEnabled() {
  console.log("webmidi.js for MIDI input is on!"); //post to console if WebMidi enabled

  // Inputs
  WebMidi.inputs.forEach(input => console.log(input.manufacturer, input.name, input.id));
  
  // Outputs
  WebMidi.outputs.forEach(output => console.log(output.manufacturer, output.name, output.id));

  midi_in = WebMidi.inputs;
};
