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
          localStorage.setItem(e.target.name, e.target.value);
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
          localStorage.setItem(e.target.name, e.target.value);
        }
        }>
        <option>---choose how the notes are sent---</option>
        <option value="multichannel">multichannel, each cycle starts from MIDI note 0</option>
        <option value="sequential">all notes on selected channel, around MIDI note 60</option>
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
          localStorage.setItem(e.target.name, parseInt(e.target.value));
        }
        }>
        <option value="-1">---place the scale fundamental--(1/1 = C4 = note 60)---</option>
        {[...Array(16).keys()].map(i => <option value={i}>{i + 1}</option>)}
      </select>
    </label>
    <label>
      Fixed Velocity
      <input name="midi_velocity" type="number"
        value={props.settings.midi_velocity}
        step="1" min="0" max="127"
        onChange={(e) => {
          if (parseInt(e.target.value) >= 0 && parseInt(e.target.value) <= 127) {
            props.onChange(e.target.name, parseInt(e.target.value));
            localStorage.setItem(e.target.name, parseInt(e.target.value));
          };
        }
        } />
    </label>
    
    <p>
    <em>Output is determined by the selected MIDI Mapping chosen above. "Multichannel" means the entire scale, up to a maximum of 128 degrees, is sent on multiple MIDI channels, around the Central Output Channel. "All notes on selected channel" sends the scale degrees sequentially, as successive MIDI notes on one channel only. The two "MTS" options send a real-time MIDI tuning message followed by a MIDI note, which triggers the retuned pitch. These options may be used directly, or in tandem with the free Oddsound MTS-ESP Mini Master/Client plug-ins, to retune compatible softsynths using other protocols (MPE or multichannel pitchbend).</em>
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
