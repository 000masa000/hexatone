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
      Central Output Channel
      <select value={props.settings.midi_channel}
        name="midi_channel"
        onChange={(e) => {
          props.onChange(e.target.name, parseInt(e.target.value));
          localStorage.setItem(e.target.name, parseInt(e.target.value));
        }
        }>
        <option value>place the scale fundamental (1/1 = C4 = note 60):</option>
        {[...Array(16).keys()].map(i => <option value={i}>{i + 1}</option>)}
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
        <option>choose how the notes are sent</option>
        <option value="multichannel">one cycle per channel, starting from MIDI note 0</option>
        <option value="sequential">all notes on selected channel, around MIDI note 60</option>
        <option value="MTS">notes and MTS tuning data on selected channel</option>
      </select>
    </label>
    <label>
      Fixed Velocity
      <input name="midi_velocity" type="number"
        value={props.settings.midi_velocity}
        step="1" min="0" max="127"
        onChange={(e) => {
          props.onChange(e.target.name, parseInt(e.target.value));
          localStorage.setItem(e.target.name, parseInt(e.target.value));
        }
        } />
    </label>
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
