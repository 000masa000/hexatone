// TODO midi panic button
export const create_midi_synth = async (midi_output, channel, velocity) => {
    return {
    makeHex: (coords, cents, pressed_interval, steps, octaves, equivSteps) => {
        return new MidiHex(coords, steps, octaves, equivSteps, midi_output, channel, velocity);
    }
    };
};

function MidiHex(coords, steps, octaves, equivSteps, midi, channel, velocity) {
  var split = ((channel + octaves + 16) % 16);
  var scale_size = equivSteps;
  var steps_cycle = (steps + (scale_size * 2048)) % scale_size;

  this.coords = coords; // these end up being used by the keys class
  this.release = false;

  this.steps = steps_cycle;
  this.octaves = octaves;
  this.midi = midi;
  this.channel = split;
  this.velocity = velocity;
}

MidiHex.prototype.noteOn = function() {
this.midi.send([144 + this.channel, 60 + this.steps, this.velocity]);
};

MidiHex.prototype.noteOff = function() {
this.midi.send([128 + this.channel, 60 + this.steps, this.velocity]);
};
