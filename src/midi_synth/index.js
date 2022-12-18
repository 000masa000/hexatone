// TODO midi panic button
export const create_midi_synth = async (midi_output, channel, midi_mapping, velocity) => {
    return {
    makeHex: (coords, cents, pressed_interval, steps, octaves, equivSteps) => {
        return new MidiHex(coords, steps, octaves, equivSteps, midi_output, channel, midi_mapping, velocity);
    }
    };
};

function MidiHex(coords, steps, octaves, equivSteps, midi_output, channel, midi_mapping, velocity) {
  if (midi_mapping === "sequential") {
    var steps_cycle = (steps + 60 + (16 * 128)) % 128; // cycle the steps in bunches of 128
    var split = (steps + 60) / 128; // figure out channel offset to map the steps across the MIDI channels
    split = (channel + Math.floor(split) + 16) % 16; // cycle the steps across the 16 channels
  } else if (midi_mapping === "multichannel") {
    var split = (channel + octaves + 16) % 16; // transpose each channel by an octave ... TODO replace with equivInterval
    var scale_size = equivSteps;
    var steps_cycle = 60 + ((steps + (scale_size * 2048)) % scale_size); // cycle the steps based on number of notes in a cycle TODO better from 0? Then 128 notes / equave possible ?
  }
  this.coords = coords; // these end up being used by the keys class
  this.release = false;

  this.octaves = octaves;

  this.midi_output = midi_output;
  this.channel = split;
  this.steps = steps_cycle;
  this.velocity = velocity;
}  

MidiHex.prototype.noteOn = function() {
this.midi_output.send([144 + this.channel, this.steps, this.velocity]);
};

MidiHex.prototype.noteOff = function() {
this.midi_output.send([128 + this.channel, this.steps, this.velocity]);
};
