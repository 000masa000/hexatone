import { h } from 'preact';
import { Fragment } from 'preact/compat';
import PropTypes from 'prop-types';

const MidiOut = (props) => (
  <>
    <label>
      Output Port
      <select value={props.settings.midi_device}
        midi={props.midi} name="midi_device" onChange={(e) => {
          props.onChange(e.target.name, e.target.value);
          sessionStorage.setItem(e.target.name, e.target.value);
          //console.log("MIDI Out device selected: ", sessionStorage.getItem(e.target.name));
        }
        }>
          <option value="OFF">OFF</option>
          {Array.from(props.midi.outputs.values()).map(m => (
            <option value={m.id}>{m.name}</option>
          ))}
        </select>
    </label>
    <label>
      MIDI Mapping
      <select value={props.settings.midi_mapping}
        name="midi_mapping"
        onChange={(e) => {
          props.onChange(e.target.name, e.target.value);
          sessionStorage.setItem(e.target.name, e.target.value);
          //console.log("MIDI Out mapping selected: ", sessionStorage.getItem(e.target.name));
        }
        }>
        <option>---choose how the notes are sent---</option>
        <option value="multichannel">multichannel, each cycle wraps around MIDI Degree 0</option>
        <option value="sequential">all notes on selected channel, around MIDI Degree 0</option>
        <option value="MTS1">all notes and MTS tuning data on selected channel</option>
        <option value="MTS2">Pianoteq range MTS tuning data on selected channel</option>
      </select>
    </label>
    <label>
      (Central) Output Channel
      <select value={props.settings.midi_channel}
        name="midi_channel"
        onChange={(e) => {
          props.onChange(e.target.name, parseInt(e.target.value));
          sessionStorage.setItem(e.target.name, parseInt(e.target.value));          
          let ch = parseInt(sessionStorage.getItem(e.target.name)) + 1;
          if (ch == 0) {
            ch = "OFF";
          }
          //console.log("MIDI Out channel selected: ", ch);
        }
        }>
        <option value="-1">---place the scale fundamental--(1/1 = C4 = note 60)---</option>
        {[...Array(16).keys()].map(i => <option value={i}>{i + 1}</option>)}
      </select>
    </label>
    
    <p>
      <em>MIDI Output is determined by the selected MIDI Mapping. In "Multichannel" each transposed cycle of the scale, up to a maximum of 128 degrees, is sent on a different MIDI channel, around the Central Output Channel. "All notes on selected channel" sends scale degrees as successive MIDI notes on one channel only. In either of these settings, the synth will need to load a global tuning map. To send a global tuning map based on the selected scala file and reference frequency, please choose from the options below.</em>
    </p>
    <p>
      <em>The "MTS" Midi Mappings offer an alternative approach, by sending a real-time single-note MIDI tuning message followed by a MIDI note, which triggers the retuned pitch, allowing scales with any number of notes to be played. In this case, MIDI notes used for triggering are unrelated to actual pitches. They simply cycle sequentially through all 128 possible note numbers. This allows polyphonic combinations of up to 128 retuned notes on a single channel. However, some software (e.g. Pianoteq) may filter out notes or process sounds based on the incoming note numbers, causing unexpected results.</em>
    </p>    
  </>
);

MidiOut.propTypes = {
  settings: PropTypes.shape({  
    midi_device: PropTypes.string,
    midi_channel: PropTypes.number,
    midi_mapping: PropTypes.string,   
    midi_velocity: PropTypes.number,
  }).isRequired,
  midi: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default MidiOut;
