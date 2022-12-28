// TODO midi panic button
export const create_midi_synth = async (midi_output, channel, midi_mapping, velocity) => {
    return {
    makeHex: (coords, cents, steps, equaves, equivSteps) => {
        return new MidiHex(coords, cents, steps, equaves, equivSteps, midi_output, channel, midi_mapping, velocity);
    }
    };
};

var note_count = 0;

function MidiHex(coords, cents, steps, equaves, equivSteps, midi_output, channel, midi_mapping, velocity) {
  if (midi_mapping === "sequential") {
    var steps_cycle = (steps + 60 + (16 * 128)) % 128; // cycle the steps in bunches of 128
    var split = (steps + 60) / 128; // figure out channel offset to map the steps across the MIDI channels
    split = (channel + Math.floor(split) + 16) % 16; // cycle the steps across the 16 channels
    var mts = null;
  } else if (midi_mapping === "multichannel") {
    var split = (channel + equaves + 16) % 16; // transpose each channel by an equave
    var scale_size = equivSteps;
    var offset = 0;
    if (scale_size > 68) {
      offset = 60;
    }
    var mts = null;
    var steps_cycle = 60 - offset + ((steps + (scale_size * 2048)) % scale_size); // cycle the steps based on number of notes in a cycle, if scale is big then start from 0 else leave as 60 ... TODO maybe better to just have it from 0?
  } /* if (midi_mapping === "MTS") { // or output on a single channel with MIDI tuning standard sysex messages to produce the desired tuning
    var split = channel;
    var steps_cycle = Math.floor(cents / 100.)
    var mts = [];
    mts[0] = steps_cycle + 60;
    mts[1] = (cents * 0.01) - steps_cycle;
    steps_cycle = note_count;
    mts[1] = Math.round(16384 * mts[1]);
    if (mts[1] == 16384) {
      mts[1] = 16383;
    };
    mts[2] = mts[1] / 128;
    mts[1] = Math.floor(mts[2]);
    mts[2] = Math.round(128 * (mts[2] - mts[1]));
    if (mts[2] == 128) {
      mts[2] = 127;
    };
  }*/
  this.coords = coords; // these end up being used by the keys class
  this.cents = cents;

  this.release = false;

  this.equaves = equaves;

  this.midi_output = midi_output;
  this.channel = split;
  this.steps = steps_cycle;
  this.velocity = velocity;
  this.mts = mts;
}  

MidiHex.prototype.noteOn = function () {
  if (this.mts != null) {
    this.midi_output.send([240, 127, 0, 8, 2, 0, 1, note_count, this.mts[0], this.mts[1], this.mts[2], 247]);
    console.log(this.mts);
  };
  this.midi_output.send([144 + this.channel, this.steps, this.velocity]);
  note_count = (note_count + 1) % 128;
  console.log("note_count =", note_count);
};

MidiHex.prototype.noteOff = function () {
  this.midi_output.send([128 + this.channel, this.steps, this.velocity]);
};
