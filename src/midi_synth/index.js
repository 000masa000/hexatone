import { scalaToCents } from "../settings/scale/parse-scale";
import { WebMidi } from "webmidi";

// TODO MIDI panic button
export const create_midi_synth = async (midiin_device, midi_output, channel, midi_mapping, velocity, fundamental, reference_degree, scale) => {

  var offset = 0;
  if (reference_degree > 0) {
    offset = scalaToCents(scale[reference_degree - 1]);
  };
  //console.log("reference_degree:", reference_degree);
  //console.log("offset_value (cents):", offset);
  offset = 2 ** (offset / 1200);
  //console.log("offset_value (ratio):", offset);
 
  return {
    makeHex: (coords, cents, steps, equaves, equivSteps, cents_prev, cents_next, note_played, velocity_played, bend) => {
      return new MidiHex(coords, cents, steps, equaves, equivSteps, cents_prev, cents_next, note_played, velocity_played, bend, midiin_device, midi_output, channel, midi_mapping, velocity, fundamental, offset);
    }
  };
};

var note_count = 0;
var note_count_l = 23; // Pianoteq hack: only notes 9 to 113 may be played even when using MTS (as of 2023, PTQ version 8); unfortunately, extended ranges of other instruments are even more severely limited; also, notes above a certain cutoff point (varying by model between 89 and 92) are automatically played without a damper, to optimise polyphony; to cope with this implementation MTS data is sent to two cycling note groups: sounding pitches from 0 to 88 are sent to MIDI notes 23 to 88. Sounding pitches 89 to 127 are sent to MIDI notes 92 to 106.
var note_count_h = 89;
export var notes_played = [];

export const tuningmap = new Array(128); // MTS array showing retunings indexed by note played
export const keymap = new Array(128); // array mapping originally played keys to MTS output
for (let i = 0; i < 128; i++) {
  tuningmap[i] = [i, 0, 0];  
};
for (let i = 0; i < 2048; i++) {
  keymap[i] = [i, i % 128, 0, 0, 0, 0];  // [played note + (128 * channel), mts, mts, mts, mts, bend_down, bend_up]
};

function MidiHex(coords, cents, steps, equaves, equivSteps, cents_prev, cents_next, note_played, velocity_played, bend, midiin_device, midi_output, channel, midi_mapping, velocity, fundamental, offset) {

  if (channel >= 0) {
    if (midi_mapping === "sequential") {
      var steps_cycle = (steps + 60 + (16 * 128)) % 128;
      var split = channel; // output on selected channel
      var mts = [];
      if (note_played) {
        console.log("note_played", note_played);
        keymap[note_played] = [steps_cycle, 0, 0, 0, channel];
        console.log("keymap", keymap[note_played]);
        notes_played.push(note_played);
      };    
    } else if (midi_mapping === "multichannel") {
      var split = (channel + equaves + 16) % 16; // transpose each channel by an equave
      var mts = [];
      var steps_cycle = (steps + (equivSteps * 2048)) % equivSteps; // cycle the steps based on number of notes in a cycle, start from MIDI note 0 on each channel
      keymap[note_played] = [steps_cycle, 0, 0, 0, split];
   
    } else if (midi_mapping === "MTS1") { // or output on a single channel with MIDI tuning standard sysex messages to produce the desired tuning
      var ref = fundamental / offset; // use the specified fundamental and the scale degree offset to calculate the offset for the outcoming MTS data ... MIDI softsynth must be set to 440 Hz for this to work correctly
      var ref_offset = ref / 261.6255653; // compare the fundamental assigned to standard C with C at A 440 Hz
      ref_offset = 1200 * Math.log2(ref_offset);
      var ref_cents = cents + ref_offset; // apply the offset (tuning of scale degree 0 assigned to MIDI note 60) to the incoming cents value
      var bend_up = cents_next - cents;
      var bend_down = cents - cents_prev;
     // console.log("cents_from_reference", ref_cents); // this could give a readout of cents from nearest MIDI
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
      keymap[note_played] = [mts[0], mts[1], mts[2], mts[3], bend_down, bend_up];
      notes_played.push(note_played);
      
      if (bend < 0) {
        bend = bend * bend_down;
      } else {
        bend = bend * bend_up;
      };
      //console.log("bend", bend);
      var mts_bend = centsToMTS(mtsToMidiFloat([mts[1], mts[2], mts[3]]), bend);
      console.log("mts_bend", mts_bend);
      mts[1] = mts_bend[0];
      mts[2] = mts_bend[1];
      mts[3] = mts_bend[2];
    
    } else if (midi_mapping === "MTS2") { // or output on a single channel with MIDI tuning standard sysex messages to produce the desired tuning
      var ref = fundamental / offset; // use the specified fundamental and the scale degree offset to calculate the offset for the outcoming MTS data ... MIDI softsynth must be set to 440 Hz for this to work correctly
      var ref_offset = ref / 261.6255653; // compare the fundamental assigned to standard C with C at A 440 Hz
      ref_offset = 1200 * Math.log2(ref_offset);
      var ref_cents = cents + ref_offset; // apply the offset (tuning of scale degree 0 assigned to MIDI note 60) to the incoming cents value
     // console.log("cents_from_reference", ref_cents); // this could give a readout of cents from nearest MIDI
      var bend_up = cents_next - cents;
      var bend_down = cents - cents_prev;
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
      keymap[note_played] = [mts[0], mts[1], mts[2], mts[3], bend_down, bend_up];
      notes_played.push(note_played);
     
      if (bend < 0) {
        bend = bend * bend_down;
      } else {
        bend = bend * bend_up;
      };
      //console.log("bend", bend);
      var mts_bend = centsToMTS(mtsToMidiFloat([mts[1], mts[2], mts[3]]), bend);
      console.log("mts_bend", mts_bend);
      mts[1] = mts_bend[0];
      mts[2] = mts_bend[1];
      mts[3] = mts_bend[2];
    }
    
    this.coords = coords; // these end up being used by the keys class
    this.cents = cents;
    this.bend_down = bend_down;
    this.bend_up = bend_up;
    this.equaves = equaves;

    this.release = false;
 
    if (velocity_played > 0) { // get release velocity in here
      this.velocity = velocity_played;
    } else {
      this.velocity = velocity;
    };

    this.note_played = note_played;
    //console.log("note_played", note_played);

    this.midiin_device = midiin_device;
    this.midi_output = midi_output;
    this.channel = split;
    this.steps = steps_cycle;
    this.mts = mts;
    //this.mts_bend = mts_bend;

  } else {
    console.log("Please choose an output channel!");
  };
}

MidiHex.prototype.noteOn = function () {
  
  if (this.mts.length > 0) { // send single note tuning change, TODO modify by bend
    this.midi_output.send([240, 127, 127, 8, 2, 0, 1, this.mts[0], this.mts[1], this.mts[2], this.mts[3], 247]);
    console.log("MTS target note and tuning:", this.mts[0], this.mts[1] + (this.mts[2] / 128) + (this.mts[3] / 16384));  
  };

  this.midi_output.send([144 + this.channel, this.steps, this.velocity]);  
  console.log("(output) note_on:", this.channel + 1, this.steps, this.velocity);
  console.log("notes_played after noteon:", notes_played);
};

MidiHex.prototype.noteOff = function () {
  
  this.midi_output.send([128 + this.channel, this.steps, this.velocity]);
  console.log("(output) note_off:", this.channel + 1, this.steps, this.velocity);
  
  let index = notes_played.lastIndexOf(this.note_played); // eliminate note_played from array of played notes
  if (index >= 0) {
    let first_half = [];
    first_half = notes_played.slice(0, index);
    let second_half = [];
    second_half = notes_played.slice(index);
    second_half.shift();
    let newarray = [];
    notes_played = newarray.concat(first_half, second_half);
    console.log("notes_played after noteoff", notes_played);
  };  
};

export function centsToMTS(note, bend) {
  let mts = []
  mts[0] = Math.floor(note);
  let total_bend = (bend * 0.01) + note - mts[0];

  let shift = Math.floor(total_bend);
  let remainder = total_bend - shift;

  mts[0] = mts[0] + shift;
  mts[1] = 16384 * remainder;
  mts[1] = Math.round(mts[1]);
  if (mts[1] == 16384) {
    mts[1] = 16383;
  };
  mts[2] = mts[1] / 128;
  mts[1] = Math.floor(mts[2]);
  mts[2] = Math.round(128 * (mts[2] - mts[1]));
  if (mts[2] == 128) {
    mts[2] = 127;
  };

  return mts;
}

export function mtsToMidiFloat(mts) {
  let midifloat = mts[0] + (mts[1] / 128) + (mts[2] / 16384);
  return midifloat;
};
