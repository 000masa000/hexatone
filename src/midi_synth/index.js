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
    var steps_cycle = (steps + 60 + (16 * 128)) % 128;
    var split = (steps + 60) / 128;
    split = (channel + Math.floor(split) + 16) % 16;
  } else if (midi_mapping === "multichannel") {
    var split = (channel + octaves + 16) % 16;
    var scale_size = equivSteps;
    var steps_cycle = 60 + ((steps + (scale_size * 2048)) % scale_size);
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
