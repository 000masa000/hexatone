// TODO MIDI panic button
export const create_midi_synth = async (midi_output, channel, midi_mapping, velocity) => {
    return {
    makeHex: (coords, cents, pressed_interval, steps, equaves, equivSteps, velocity_played) => {
        return new MidiHex(coords, cents, steps, equaves, equivSteps, velocity_played, midi_output, channel, midi_mapping, velocity);
    }
    };
};

var note_count = 0;

function MidiHex(coords, cents, steps, equaves, equivSteps, velocity_played, midi_output, channel, midi_mapping, velocity) {

  if (channel >= 0) {
    if (midi_mapping === "sequential") {
      var steps_cycle = (steps + 60 + (16 * 128)) % 128;
      var split = channel; // output on selected channel
      var mts = [];
    } else if (midi_mapping === "multichannel") {
      var split = (channel + equaves + 16) % 16; // transpose each channel by an equave
      var mts = [];
      var steps_cycle = (steps + (equivSteps * 2048)) % equivSteps; // cycle the steps based on number of notes in a cycle, start from MIDI note 0 on each channel
    } if (midi_mapping === "MTS") { // or output on a single channel with MIDI tuning standard sysex messages to produce the desired tuning
      var split = channel;
      var steps_cycle = Math.floor(cents / 100.)
      var mts = [];
      mts[0] = steps_cycle + 60; // calculates the desired note and two bytes of tuning resolution
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
    }
    this.coords = coords; // these end up being used by the keys class
    this.cents = cents;
    this.equaves = equaves;

    this.release = false;
 
    if (velocity_played > 0) {
      this.velocity = velocity_played;
    } else {
      this.velocity = velocity;
    };

    this.midi_output = midi_output;
    this.channel = split;
    this.steps = steps_cycle;
    this.mts = mts;
  } else {
    console.log("Please choose an output channel!");
  };
}  

MidiHex.prototype.noteOn = function () {
  if (this.mts.length > 0) {
    this.midi_output.send([240, 127, 0, 8, 2, 0, 1, note_count, this.mts[0], this.mts[1], this.mts[2], 247]);
    console.log("MTS target note and tuning:", note_count, this.mts[0] + (this.mts[1]/128) + (this.mts[2]/16384));
  };
  this.midi_output.send([144 + this.channel, this.steps, this.velocity]);
  note_count = (note_count + 1) % 128;
  console.log("note_on:", this.channel+1,this.steps, this.velocity);
};

MidiHex.prototype.noteOff = function () {
  this.midi_output.send([128 + this.channel, this.steps, this.velocity]);
  console.log("note_off:", this.channel+1,this.steps, 0);
};
