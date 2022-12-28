import { h } from 'preact';
import { Fragment } from 'preact/compat';
import PropTypes from 'prop-types';

const MidiOutSelect = (props) => (
  <select name="midi_device" onChange={(e) => props.onChange(e.target.name, e.target.value)}>
    <option></option>
    {Array.from(props.midi.outputs.values()).map(m => (
      <option value={m.id}>{m.name}</option>
    ))}
  </select>
);

const MidiOut = (props) => (
  <>
    <label>
      Output Port
      <MidiOutSelect value={props.settings.midi}
                  midi={props.midi}
                  onChange={props.onChange}/>
    </label>
    <label>
      Central Output Channel
      <select value={props.settings.midi_channel}
              name="midi_channel"
              onChange={(e) => props.onChange(e.target.name, parseInt(e.target.value))}>
        <option>place the scale fundamental (1/1 = C4 = note 60):</option>
        {[...Array(16).keys()].map(i => <option value={i}>{i + 1}</option>)}
      </select>
    </label>
    <label>
      MIDI Mapping
      <select value={props.settings.midi_mapping}
              name="midi_mapping"
        onChange={(e) => props.onChange(e.target.name, e.target.value)}>
        <option>choose how the notes are sent</option>
        <option value="multichannel">one cycle + equave per channel</option>
        <option value="sequential">using all notes 0-127 across all channels</option>
        <option value="MTS">notes and MTS data on selected channel</option>
      </select>
    </label>
    <label>
      Fixed Velocity
      <input name="midi_velocity" type="number"
             value={props.settings.midi_velocity}
             step="1" min="0" max="127"
             onChange={(e) => props.onChange(e.target.name, parseInt(e.target.value))} />
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
