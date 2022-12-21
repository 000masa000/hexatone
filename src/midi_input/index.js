import { WebMidi } from "webmidi";

WebMidi
  .enable()
  .then(onEnabled)
  .catch(err => alert(err));

function onEnabled() {
  console.log("webmidi on"); //post to console if WebMidi enabled

  // Inputs
  WebMidi.inputs.forEach(input => console.log(input.manufacturer, input.name, input.id));
  
  // Outputs
  WebMidi.outputs.forEach(output => console.log(output.manufacturer, output.name, output.id));

  //const myInput = WebMidi.getInputByName("UCX Midi Port 1");

  WebMidi.inputs.forEach(input => {
    input.addListener("noteon", e => {
      console.log(e.note.number, e.note.rawAttack)
    });
  });
};

function parseMIDIin() { };