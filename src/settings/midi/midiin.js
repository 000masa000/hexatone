import { options } from "preact";
import { WebMidi } from "webmidi";

export var midi_in = [];

WebMidi
  .enable( { sysex:true } )
.then(onEnabled)
.catch(err => alert(err));

function onEnabled() {
  console.log("webmidi.js for MIDI input is on!"); //post to console if WebMidi enabled

  // Inputs
  WebMidi.inputs.forEach(input => console.log(input.manufacturer, input.name, input.id));
  midi_in = WebMidi.inputs; // assign to global
  
  // Outputs
  WebMidi.outputs.forEach(output => console.log(output.manufacturer, output.name, output.id));
}
