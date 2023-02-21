// TODO MIDI panic button
export const create_midi_synth = async (midi_output, channel, midi_mapping, velocity, fundamental) => {
    return {
    makeHex: (coords, cents, pressed_interval, steps, equaves, equivSteps, note_played, velocity_played) => {
        return new MidiHex(coords, cents, steps, equaves, equivSteps, note_played, velocity_played, midi_output, channel, midi_mapping, velocity, fundamental);
    }
    };
};

var note_count = 0;
var note_count_l = 23; // Pianoteq hack: only notes 9 to 113 may be played even when using MTS (as of 2023, PTQ version 8); unfortunately, extended ranges of other instruments are even more severely limited; also, notes above a certain cutoff point (varying by model between 89 and 92) are automatically played without a damper, to optimise polyphony; to cope with this implementation MTS data is sent to two cycling note groups: sounding pitches from 0 to 88 are sent to MIDI notes 23 to 88. Sounding pitches 89 to 127 are sent to MIDI notes 92 to 106.
var note_count_h = 89;

export const tuningmap = new Array(128); // MTS array showing retunings indexed by note played
export const keymap = new Array(128); // array mapping originally played keys to MTS output
for (let i = 0; i < 128; i++) {
  tuningmap[i] = [i, 0, 0];  
};
for (let i = 0; i < 16384; i++) {
  keymap[i] = [0, 0, 0, 0];  
};

function MidiHex(coords, cents, steps, equaves, equivSteps, note_played, velocity_played, midi_output, channel, midi_mapping, velocity, fundamental) {

  if (channel >= 0) {
    if (midi_mapping === "sequential") {
      var steps_cycle = (steps + 60 + (16 * 128)) % 128;
      var split = channel; // output on selected channel
      var mts = [];
    } else if (midi_mapping === "multichannel") {
      var split = (channel + equaves + 16) % 16; // transpose each channel by an equave
      var mts = [];
      var steps_cycle = (steps + (equivSteps * 2048)) % equivSteps; // cycle the steps based on number of notes in a cycle, start from MIDI note 0 on each channel
    } else if (midi_mapping === "MTS1") { // or output on a single channel with MIDI tuning standard sysex messages to produce the desired tuning
      var ref = fundamental; // use the desired fundamental to calculate an offset for the outcoming MTS data ... problem: MIDI softsynth must be set to 440 Hz for this to work correctly ????
      var ref_offset = fundamental / 261.6255653;
      ref_offset = 1200 * Math.log2(ref_offset);
      var ref_cents = cents + ref_offset; // apply the offset (tuning of scale degree 0 assigned to MIDI note 60) to the incoming cents value
      console.log("cents_from_reference", ref_cents);
      var split = channel;
      var steps_cycle = Math.floor(ref_cents / 100.); // finds the number of steps from the desired reference frequency produced by MIDI note 60 (middle C), notice that any global retuning of the softsynth other than 440Hz will change this as well!
      //console.log("steps_cycle",steps_cycle);
      var mts = [];
      mts[0] = note_count;
      note_count = (note_count + 1) % 128; // cycles the notes sent as carriers of MTS data
      mts[1] = (steps_cycle + 180) % 120; // calculates the desired note and two bytes of tuning resolution, offset from MIDI note C4 (60)
      mts[2] = (ref_cents * 0.01) - steps_cycle;
      steps_cycle = mts[0];
      mts[2] = Math.round(16384 * mts[2]);
      if (mts[2] == 16384) {
        mts[2] = 16383;
      };
      mts[3] = mts[2] / 128;
      mts[2] = Math.floor(mts[3]);
      mts[3] = Math.round(128 * (mts[3] - mts[2]));
      if (mts[3] == 128) {
        mts[3] = 127;
      };
      tuningmap[mts[0]] = [mts[1], mts[2], mts[3]]; // not currently used
      keymap[note_played] = [mts[0], mts[1], mts[2], mts[3]]; // allows key aftertouch to be remapped
    } else if (midi_mapping === "MTS2") { // or output on a single channel with MIDI tuning standard sysex messages to produce the desired tuning
      var ref = fundamental; // use the desired fundamental to calculate an offset for the outcoming MTS data ... problem: MIDI softsynth must be set to 440 Hz for this to work correctly ????
      var ref_offset = fundamental / 261.6255653;
      ref_offset = 1200 * Math.log2(ref_offset);
      var ref_cents = cents + ref_offset; // apply the offset (tuning of scale degree 0 assigned to MIDI note 60) to the incoming cents value
      console.log("cents_from_reference", ref_cents);
      var split = channel;
      var steps_cycle = Math.floor(ref_cents / 100.); // finds the number of steps from the desired reference frequency produced by MIDI note 60 (middle C), notice that any global retuning of the softsynth other than 440Hz will change this as well!
      //console.log("steps_cycle",steps_cycle);
      var mts = [];
      mts[1] = (steps_cycle + 180) % 120; // calculates the desired note and two bytes of tuning resolution, offset from MIDI note C4 (60)
      if (mts[1] <= 88) {
        mts[0] = note_count_l;
        note_count_l = ((note_count_l - 22) % 66) + 23; // cycles the notes to be played with dampers
      } else {
        mts[0] = note_count_h;
        note_count_h = ((note_count_h - 88) % 18) + 89; // cycles the notes to be played without dampers
      };    
      mts[2] = (ref_cents * 0.01) - steps_cycle;
      steps_cycle = mts[0];
      mts[2] = Math.round(16384 * mts[2]);
      if (mts[2] == 16384) {
        mts[2] = 16383;
      };
      mts[3] = mts[2] / 128;
      mts[2] = Math.floor(mts[3]);
      mts[3] = Math.round(128 * (mts[3] - mts[2]));
      if (mts[3] == 128) {
        mts[3] = 127;
      };
      tuningmap[mts[0]] = [mts[1], mts[2], mts[3]]; // not currently used
      keymap[note_played] = [mts[0], mts[1], mts[2], mts[3]]; // allows key aftertouch to be remapped
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
    this.midi_output.send([240, 127, 0, 8, 2, 0, 1, this.mts[0], this.mts[1], this.mts[2], this.mts[3], 247]);
    this.midi_output.send([240, 127, 127, 8, 2, 0, 1, this.mts[0], this.mts[1], this.mts[2], this.mts[3], 247]);
    console.log("MTS target note and tuning:", this.mts[0], this.mts[1] + (this.mts[2] / 128) + (this.mts[3] / 16384));    
  };
  this.midi_output.send([144 + this.channel, this.steps, this.velocity]);  
  console.log("(output) note_on:", this.channel+1,this.steps, this.velocity);
};

MidiHex.prototype.noteOff = function () {
  this.midi_output.send([128 + this.channel, this.steps, this.velocity]);
  console.log("(output) note_off:", this.channel+1,this.steps, this.velocity);
};
